'use client';

import { v4 as uuid } from 'uuid';
import randomChars from 'random-chars';
import { ChannelProvider } from 'ably/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import PlanningPoker from '@features/planningPoker/PlanningPoker';
import { AblyProvider } from 'providers/AblyProvider';

const userId = uuid();

export default function PlanningPokerView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const r = searchParams?.get('r');
  const router = useRouter();
  const roomId = r || (randomChars.get(16) as string);

  useEffect(() => {
    if (!r) {
      router.push(`${pathname}?r=${roomId}`);
    }
  }, []);

  return (
    <AblyProvider>
      <ChannelProvider channelName={roomId}>
        <PlanningPoker roomId={roomId} userId={userId} />
      </ChannelProvider>
    </AblyProvider>
  );
}
