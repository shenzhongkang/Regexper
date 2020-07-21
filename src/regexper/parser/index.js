// Entry point for the JavaScript-flavor regular expression parsing and
// rendering. Actual parsing code is in
// [parser.js](./javascript/parser.html) and the grammar file. Rendering code
// is contained in the various subclasses of
// [Node](./javascript/node.html)

import Snap from 'snapsvg';
import _ from 'lodash';

import util from '../util';
import javascript from './javascript/parser';
import ParserState from './javascript/parser_state';

export default class Parser {
  // - __container__ - DOM node that will contain the rendered expression
  // - __options.keepContent__ - Boolean indicating if content of the container
  //    should be preserved after rendering. Defaults to false (don't keep
  //    contents)
  constructor(container, options) {
    this.options = options || {};
    _.defaults(this.options, {
      keepContent: false
    });
    this.container = container;

    // The [ParserState](./javascript/parser_state.html) instance is used to
    // communicate between the parser and a running render, and to update the
    // progress bar for the running render.
    this.state = new ParserState(this.container.querySelector('#regexp-progress div'));
  }

  // DOM node that will contain the rendered expression. Setting this will add
  // the base markup necessary for rendering the expression, and set the
  // `svg-container` class
  set container(cont) {
    this._container = cont;
    this._container.innerHTML = [
      `
        <div class='svg'>
          <svg
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          >
            <metadata>
              <rdf:RDF>
                <cc:License rdf:about="http://creativecommons.org/licenses/by/3.0/">
                  <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction" />
                  <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution" />
                  <cc:requires rdf:resource="http://creativecommons.org/ns#Notice" />
                  <cc:requires rdf:resource="http://creativecommons.org/ns#Attribution" />
                  <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks" />
                </cc:License>
              </rdf:RDF>
            </metadata>
          </svg>
        </div>
        <div id='regexp-progress'>
          <div style={{ width: 0 }}></div>
        </div>
      `,
      this.options.keepContent ? this.container.innerHTML : ''
    ].join('');
    this._addClass('svg-container');
  }

  get container() {
    return this._container;
  }

  // Helper method to simplify adding classes to the container.
  _addClass(className) {
    this.container.className = _(this.container.className.split(' '))
      .union([className])
      .join(' ');
  }

  // Helper method to simplify removing classes from the container.
  _removeClass(className) {
    this.container.className = _(this.container.className.split(' '))
      .without(className)
      .join(' ');
  }

  // Parse a regular expression into a tree of
  // [Nodes](./javascript/node.html) that can then be used to render an SVG.
  // - __expression__ - Regular expression to parse.
  async parse(expression) {
    this._addClass('loading');

    // Allow the browser to repaint before parsing so that the loading bar is
    // displayed before the (possibly lengthy) parsing begins.
    await util.tick();
    javascript.Parser.SyntaxNode.state = this.state;
    this.parsed = javascript.parse(expression.replace(/\n/g, '\\n'));
    return this;
  }

  // Render the parsed expression to an SVG.
  render() {
    let svg = Snap(this.container.querySelector('svg'));

    return this.parsed.render(svg.group())
      // Once rendering is complete, the rendered expression is positioned and
      // the SVG resized to create some padding around the image contents.
      .then(result => {
        let box = result.getBBox();

        result.transform(Snap.matrix()
          .translate(10 - box.x, 10 - box.y));
        svg.attr({
          width: box.width + 20,
          height: box.height + 20
        });
      })
      // Stop and remove loading indicator after render is totally complete.
      .then(() => {
        this._removeClass('loading');
        this.container.removeChild(this.container.querySelector('#regexp-progress'));
      });
  }

  // Cancels any currently in-progress render.
  cancel() {
    this.state.cancelRender = true;
  }

  // Returns any warnings that may have been set during the rendering process.
  get warnings() {
    return this.state.warnings;
  }
}
