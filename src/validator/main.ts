/**
 * Main Function
 */
import Validator from './validator';

export const init = () => {
  if (document.body.querySelector('#regexp-app')) {
    const validator = new Validator(document.body);
    validator.bindListeners();
  }
};