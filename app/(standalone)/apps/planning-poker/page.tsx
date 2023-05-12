import React from 'react';
import PlanningPoker from '@features/planningPoker/PlanningPoker';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planning Poker',
  description: 'Planning tool for Scrum team'
};

export default async function PlanningPokerApp() {
  return <PlanningPoker />;
}
