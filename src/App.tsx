import React, { useEffect } from 'react';
import { init } from './regexper/main';
import RegexperComponent from './regexper';
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
      <main className={styles.main}>
        <RegexperComponent />
        <div className={styles.divider}></div>
        <ValidatorComponent />
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
