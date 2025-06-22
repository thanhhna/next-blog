import { Metadata } from 'next';
import PlanningPokerView from './PlanningPokerView';

export const metadata: Metadata = {
  title: 'Planning Poker',
  description: 'Planning tool for Scrum team'
};

export default async function PlanningPokerApp() {
  return <PlanningPokerView />;
}
