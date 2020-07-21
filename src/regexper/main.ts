/**
 * Main Function
 */
import util from './util';
import Regexper from './regexper';
import _ from 'lodash';
import Parser from './parser';

export const init = () => {
  if (document.body.querySelector('#regexp-app')) {
    const regexper = new Regexper(document.body);
    
    regexper.detectBuggyHash();
    regexper.bindListeners();

    util.tick().then(() => {
      window.dispatchEvent(util.customEvent('hashchange'));
    });
  }

  // Initialize other pages on the site (specifically the documentation page).
  // Any element with a `data-expr` attribute will contain a rendering of the
  // provided regular expression.
  _.each(document.querySelectorAll('[data-expr]'), element => {
    new Parser(element, { keepContent: true })
      .parse(element.getAttribute('data-expr'))
      .then(parser => {
        parser.render();
      })
      .catch(util.exposeError);
  });
}