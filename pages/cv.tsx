import React, { useState } from 'react';
import Layout from 'components/Layout';
import FollowTheClue from 'features/puzzles/FollowTheClue';
import styles from './cv.module.scss';
import utilStyles from 'styles/utils.module.scss';

export default function CV(): JSX.Element {
  const [started, setStarted] = useState(true);
  const [isSolved, setIsSolved] = useState(false);

  function handleClick() {
    setStarted(true);
  }

  function download() {
    // download cv
  }

  const puzzleClass = !started || isSolved ? utilStyles.hide : '';

  return (
    <Layout title="My CV">
      {started && !isSolved ? <FollowTheClue /> : null}
      <div className={styles.cv}>
        {!started &&
          (isSolved ? (
            <p className={styles.won}>
              You solved it! Click{' '}
              <span onClick={download} className={utilStyles.link}>
                here
              </span>{' '}
              to download the CV. Thank you.
            </p>
          ) : (
            <>
              <h2 className={utilStyles.headingLg}>Welcome</h2>
              <p>I'm very appreciate that you interested in my resume.</p>
              <p>
                So I want you to have some fun, let's solve a simple puzzle with
                me.
              </p>
              <p>I hope you can enjoy it.</p>
              <p>
                <span onClick={handleClick} className={utilStyles.link}>
                  Let's start
                </span>
              </p>
            </>
          ))}
      </div>
    </Layout>
  );
}
