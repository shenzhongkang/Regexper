/**
 * Regexper Container
 */
import React from 'react';
import styles from '../styles/regexper.module.scss';

const RegexperComponent = () => {
  return (
    <>
      <form id='regexp-form' className={styles.form}>
        <textarea
          className={styles.input}
          id='regexp-input'
          autoFocus
          placeholder='Enter JavaScript-style regular expression to display'
          rows={4}
        />
        <button className={styles.button} type='submit'>
          Display
        </button>
      </form>
      <div className={styles.results} id='regexp-results'>
        <div className={styles.error} id='regexp-error'></div>
        <div className={styles.warnings} id='regexp-warnings'></div>
        <div className={styles.renderer} id='regexp-render'></div>
      </div>
      <div className={styles.baseSvg} id='regexp-render-base'>
        <svg xmlns='http://www.w3.org/2000/svg' version='1.1'></svg>
      </div>
      <div className={styles.progress} id='regexp-progress'></div>
    </>
  );
};

export default RegexperComponent;