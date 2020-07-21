/**
 * Main Function
 */
import util from './util';
import Regexper from './regexper';

export const init = () => {
  if (document.body.querySelector('#regexp-app')) {
    const regexper = new Regexper(document.body);
    
    regexper.detectBuggyHash();
    regexper.bindListeners();

    util.tick().then(() => {
      window.dispatchEvent(util.customEvent('hashchange'));
    });
  }
}