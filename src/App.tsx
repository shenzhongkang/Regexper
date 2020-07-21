import React, { useEffect } from 'react';
import { init } from './regexper/main';
import Regexper from './regexper';
import styles from './styles/app.module.scss';
import ValidatorComponent from './validator';

function App() {
  useEffect(() => {
    init();
  }, []);

  return (
    <div className={styles.container}>
      <nav>
        Regexper
        <a
          href='https://regexper.com/'
          rel='noopener noreferrer'
          target='_blank'
        >
          &copy;
        </a>
      </nav>
      <main id='regexp-app' className={styles.main}>
        <div className={styles.display}>
          <Regexper />
        </div>
        <div className={styles.divider}></div>
        <div className={styles.validate}>
          <ValidatorComponent />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
