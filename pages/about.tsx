import React from 'react';

import Layout from 'components/Layout';
import styles from './about.module.scss';
import utilStyles from 'styles/utils.module.scss';

export default function About(): JSX.Element {
  return (
    <Layout title="About">
      <div className={styles.about}>
        <h2 className={utilStyles.headingLg}>About me</h2>
        <p>Hi, I'm Thanh.</p>
        <p>I'm mostly a web developer.</p>
        <p>
          I like coding in JS/TS, speed-cubing, playing StreetFighter V, and
          keyboard.
        </p>
        <p>
          This site is my little corner, it doesn't has much, mostly to store
          things I know but I may forget.
        </p>
      </div>
    </Layout>
  );
}
