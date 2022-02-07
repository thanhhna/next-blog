import React from 'react';

import Layout from 'components/Layout';
import GomokuController from 'features/gomoku/Gomoku';

export default function Gomoku() {
  return (
    <Layout title="Gomoku">
      <GomokuController />
    </Layout>
  );
}
