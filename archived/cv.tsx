import React, { useState, useRef } from 'react';
import sha256 from 'crypto-js/sha256';
import SequenceController from 'features/sequence/Sequence';
import Layout from 'components/Layout';
import { gen, get } from 'api/cv';
import styles from './cv.module.scss';
import utilStyles from 'styles/utils.module.scss';


export default function CV() {
  const [started, setStarted] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const key = useRef({a: '', b: ''});

  const code = useRef({a: '', b: '', c: ''});

  async function handleStart() {
    try {
      const data = await gen();
      code.current = data; 
    } catch(e) {
      throw e;
    }
  }

  function handleFinish() {
    if (isWon) {
      return;
    }

    const firstLeg = sha256(code.current.a, code.current.b).toString();
    const secondLeg = sha256(firstLeg, code.current.c).toString();

    key.current = { a: code.current.a, b: secondLeg };

    setIsWon(true);
    setStarted(false);
  }

  function handleClick() {
    setStarted(true);
  }

  function download() {
    get(key.current);
  }

  const boardClassName = !started || isWon ? utilStyles.hide : '';

  return (
    <Layout title="My CV">
      <SequenceController onStart={handleStart} onFinish={handleFinish} className={boardClassName} />
      <div className={styles.cv}>
        { !started && (
            isWon ? (
              <p className={styles.won}>
                You won! Click <span onClick={download} className={utilStyles.link}>here</span> to download the CV. Thank you.
              </p>
            ) : (
              <>
                <h2 className={utilStyles.headingLg}>Welcome</h2>
                <p>
                  I'm glad that you interested in my resume.
                </p>
                <p>
                  But I really don't want it to just be another resume that easily be passed around.
                </p>
                <p>
                  So please take your time, play a game with me, you will get it after you win.
                </p>
                <p>
                  And because you have to spend time to earn it, please consider not to share it with whom who hasn't,<br/>
                  they probably doesn't care much about it anyway.
                </p>
                <p>
                  If you have came here and read this, I truly appreciate your time and effort. Thank you very much.
                </p>
                <p>
                  <span onClick={handleClick} className={utilStyles.link}>Now let's play.</span>
                </p>
              </>
            )
          )
        }
      </div>
    </Layout>
  );
}