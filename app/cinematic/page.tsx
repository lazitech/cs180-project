import type { Metadata } from 'next';
import { CinematicDeck } from '@/components/cinematic-deck';

export const metadata: Metadata = {
  title: 'Project 0',
};

export default function CinematicPage() {
  return <CinematicDeck />;
}
