import React from 'react';

import Layout from 'components/Layout';
import GomokuController from 'features/gomoku';


export default function Gomoku() {
  return (
    <Layout title="Gomoku">
      <GomokuController />
    </Layout>
  );
}