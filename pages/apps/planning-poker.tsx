import React from 'react';
import PlanningPoker from '../../features/planningPoker/PlanningPoker';
import Layout from '../../components/Layout';

export default function PlanningPokerApp() {
  return (
    <Layout title="Planning Poker">
      <PlanningPoker />
    </Layout>
  );
}
