import React from 'react';

import Layout from 'components/Layout';
import utilStyles from 'styles/utils.module.scss';

export default function About() {
  return (
    <Layout title="About">
      <h2 className={utilStyles.headingLg}>About me</h2>
      <p>Hi I'm Thanh.</p>
      <p>I like coding in JS and do other stuff.</p>
    </Layout>
  );
}