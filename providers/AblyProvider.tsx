'use client';

import { AblyProvider as AblyReactProvider } from 'ably/react';
import Ably from 'ably';
import React from 'react';

const client = new Ably.Realtime({
  authUrl: '/api/ablyAuth'
});

export const AblyProvider = ({ children }: { children: React.ReactNode }) => {
  return <AblyReactProvider client={client}>{children}</AblyReactProvider>;
};
