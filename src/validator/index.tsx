/**
 * Validator Container
 */
import React, { useEffect } from 'react';
import { init } from './main';
import styles from '../styles/validator.module.scss';

const ValidatorComponent = () => {
  useEffect(() => {
    init();
  }, []);

  return (
    <div className={styles.validate}>
      <form id='validator-form'>
        <textarea
          rows={4}
          className={styles.output}
          id='validator-input'
          placeholder='Enter text to test regular expression'
        />
        <button className={styles.button} type='submit'>
          Test
        </button>
      </form>
      <div className={styles.validator} id='validator-results'></div>
    </div>
  );
}

export default ValidatorComponent;