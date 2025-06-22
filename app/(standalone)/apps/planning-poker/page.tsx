import { Metadata } from 'next';
import PlanningPokerView from './PlanningPokerView';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Planning Poker',
  description: 'Planning tool for Scrum team'
};

export default async function PlanningPokerApp() {
  return (
    <Suspense>
      <PlanningPokerView />
    </Suspense>
  );
}
