/**
 * Regexper Container
 */
import React from 'react';
import styles from '../styles/regexper.module.scss';

const RegexperComponent = () => {
  return (
    <div className={styles.display} id='regexp-app'>
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
        {/* <ul className={styles.list} id='regexp-links'>
          <li className={styles.download_svg}>
            <a href='##' data-action='download-svg' download='image.svg' type='image/svg+xml'>
              <Icon type='data-transfer-download' />
              Download SVG
            </a>
          </li>
          <li className={styles.download_png}>
            <a href='##' data-action='download-png' download='image.png' type='image/png'>
              <Icon type='data-transfer-download' />
              Download PNG
            </a>
          </li>
        </ul> */}
      </form>
      <div className={styles.results} id='regexp-results'>
        <div className={styles.error} id='regexp-error'></div>
        <ul className={styles.warnings} id='regexp-warnings'></ul>
        <div className={styles.renderer} id='regexp-render'></div>
      </div>
    </div>
  );
};

export default RegexperComponent;