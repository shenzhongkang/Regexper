import util from './util';
import Parser from './parser';
import _ from 'lodash';

class Regexper {
  root: HTMLElement;
  buggyHash: boolean;
  form: HTMLFormElement;
  field: HTMLTextAreaElement;
  error: HTMLDivElement;
  warnings: HTMLUListElement;
  svgContainer: HTMLDivElement;
  running: Parser | undefined;
  permalinkEnable: boolean = false;

  constructor(root: HTMLElement) {
    this.root = root;
    this.buggyHash = false;
    this.form = root.querySelector('#regexp-form') as HTMLFormElement;
    this.field = root.querySelector('#regexp-input') as HTMLTextAreaElement;
    this.error = root.querySelector('#regexp-error') as HTMLDivElement;
    this.warnings = root.querySelector('#regexp-warnings') as HTMLUListElement;

    this.svgContainer = root.querySelector('#regexp-render') as HTMLDivElement;
  }

  // Event handler for key presses in the regular expression form field.
  keypressListener(event: KeyboardEvent) {
    // Pressing Shift-Enter displays the expression.
    if (event.shiftKey && event.keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
      this.form.dispatchEvent(util.customEvent('submit'));
    }
  }

  // Event handler for key presses while focused anywhere in the application.
  documentKeypressListener(event: KeyboardEvent) {
    // Pressing escape will cancel a currently running render.
    if (event.keyCode === 27 && this.running) {
      this.running.cancel();
    }
  }

  // Event handler for submission of the regular expression. Changes the URL
  // hash which leads to the expression being rendered.
  submitListener(event: Event) {
    event.returnValue = false;
    if (event.preventDefault) {
      event.preventDefault();
    }

    try {
      this.setHash(this.field.value);
    } catch (e) {
      // Failed to set the URL hash (probably because the expression is too
      // long). Turn off display of the permalink and just show the expression.
      this.permalinkEnable = false;
      this.showExpression(this.field.value);
    }
  }

  // Event handler for URL hash changes. Starts rendering of the expression.
  hashchangeListener() {
    let expr = this.getHash();

    if (expr instanceof Error) {
      this.setState('has-error');
      this.error.innerHTML = 'Malformed expression in URL';
    } else {
      this.permalinkEnable = true;
      this.showExpression(expr);
    }
  }

  // Binds all event listeners.
  bindListeners() {
    this.field.addEventListener('keypress', this.keypressListener.bind(this));
    this.form.addEventListener('submit', this.submitListener.bind(this));
    this.root.addEventListener('keyup', this.documentKeypressListener.bind(this));
    window.addEventListener('hashchange', this.hashchangeListener.bind(this));
  }

  // Detect if https://bugzilla.mozilla.org/show_bug.cgi?id=483304 is in effect
  detectBuggyHash() {
    if (typeof window.URL === 'function') {
      try {
        let url = new URL(`${window.location.origin}/#%25`);
        this.buggyHash = (url.hash === '#%');
      } catch (e) {
        this.buggyHash = false;
      }
    }
  }

  // Set the URL hash. This method exists to facilitate automated testing
  // (since changing the URL can throw off most JavaScript testing tools).
  setHash(hash: string) {
    window.location.hash = encodeURIComponent(hash).replace(/\(/g, '%28').replace(/\)/g, '%29');
  }

  // Retrieve the current URL hash. This method is also mostly for supporting
  // automated testing, but also does some basic error handling for malformed
  // URLs.
  getHash(): string | Error {
    try {
      let hash = window.location.hash.slice(1);
      return this.buggyHash ? hash : decodeURIComponent(hash);
    } catch (e) {
      return e;
    }
  }

  // Currently state of the application. Useful values are:
  //  - `''` - State of the application when the page initially loads
  //  - `'is-loading'` - Displays the loading indicator
  //  - `'has-error'` - Displays the error message
  //  - `'has-results'` - Displays rendered results
  setState(state: string) {
    this.root.className = state;
  }
  getState(): string {
    return this.root.className;
  }

  /**
   * Start the rendering of a regular expression.
   * @param expression Regular expression to display.
   */
  showExpression(expression: string) {
    this.field.value = expression;
    this.setState('');

    if (expression !== '') {
      this.renderRegexp(expression).catch(util.exposeError);
    }
  }

  displayWarnings(warnings: string[] = []) {
    this.warnings.innerHTML = _.map(warnings, warning => (`<li class='inline-icon'>${util.icon('#warning')}${warning}</li>`)).join();
  }

  /**
   * Render regular expression
   * @param expression Regular expression to render
   */
  renderRegexp(expression: string): any {
    let parseError = false, startTime: number, endTime: number;

    // When a render is already in progress, cancel it and try rendering again
    // after a short delay (canceling a render is not instantaneous).
    if (this.running) {
      this.running.cancel();
      return util.wait(10).then(() => this.renderRegexp(expression));
    }

    this.setState('is-loading');
    startTime = new Date().getTime();

    this.running = new Parser(this.svgContainer);

    return this.running
      // Parse the expression.
      .parse(expression)
      // Display any error messages from the parser and abort the render.
      .catch(message => {
        this.setState('has-error');
        this.error.innerHTML = '';
        this.error.appendChild(document.createTextNode(message));
        parseError = true;
        throw new Error(message);
      })
      // When parsing is successful, render the parsed expression.
      .then(parser => parser.render())
      // Once rendering is complete:
      //  - Update links
      //  - Display any warnings
      //  - Track the completion of the render and how long it took
      .then(() => {
        this.setState('has-results');
        this.displayWarnings(this.running?.warnings);
        endTime = new Date().getTime();
        console.log(`timecost: ${endTime - startTime}`);
      })
      // Handle any errors that happened during the rendering pipeline.
      // Swallows parse errors and render cancellations. Any other exceptions
      // are allowed to continue on to be tracked by the global error handler.
      .catch(message => {
        if (message === 'Render cancelled') {
          this.setState('');
        } else if (parseError) {
          console.error('send - event - visualization - parseError');
        } else {
          throw message;
        }
      })
      // Finally, mark rendering as complete (and pass along any exceptions
      // that were thrown).
      .then(() => {
        this.running = undefined;
      }, message => {
        this.running = undefined;
        throw message;
      });
  }

}

export default Regexper;