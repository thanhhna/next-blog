'use client';

import React, { useEffect, useRef, useState } from 'react';
import PieChart from '@features/planningPoker/PieChart';
import PlayerList from '@features/planningPoker/PlayerList';
import { UserData } from '@features/planningPoker/types';
import { Message } from 'ably';
import {
  useAbly,
  useChannel,
  useConnectionStateListener,
  usePresence,
  usePresenceListener
} from 'ably/react';
import { IconLoader } from '@tabler/icons-react';

interface Props {
  roomId: string;
  userId: string;
}

export default function PlanningPoker({ roomId, userId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const initialData: UserData = {
    username: '',
    vote: null,
    id: userId
  };

  const [message, setMessage] = useState<Message | null>(null);

  const ably = useAbly();
  const { updateStatus: setPresenceData } = usePresence(roomId, initialData);
  const { presenceData } = usePresenceListener(roomId);
  const { publish } = useChannel(roomId, (message) => setMessage(message));
  const [connectionState, setConnectionState] = useState(ably.connection.state);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentState = ably.connection.state;
      if (currentState !== connectionState) {
        setConnectionState(currentState);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [ably, connectionState]);

  const userData = presenceData
    .sort((a, b) => (a.data.username > b.data.username ? 1 : -1))
    .map((d) => d.data);
  const user = userData.find((d) => d.id === userId) ?? ({} as UserData);

  useEffect(() => {
    const username = localStorage.getItem(roomId) ?? '';
    if (username.length > 0) {
      setPresenceData({ ...initialData, username });
    }
  }, []);

  useConnectionStateListener((stateChange) => {
    setConnectionState(stateChange.current);
  });

  useEffect(() => {
    if (message?.data?.action === 'reset') {
      setPresenceData({
        ...user,
        vote: null,
        revealed: false
      });
      setRevealed(false);
    }
    if (message?.data?.action === 'reveal') {
      setRevealed(true);
    }
  }, [message]);

  useEffect(() => {
    if (initializing && presenceData.length > 0) {
      setInitializing(false);
    }
  }, [presenceData]);

  const cards: [string, string, string?][] = [
    ['0.5', '#8a69eaff'],
    ['1', '#FF6D60'],
    ['2', '#F7D060'],
    ['3', '#3C486B'],
    ['5', '#87CBB9'],
    ['8', '#D14D72'],
    ['13', '#F9E080'],
    ['21', '#3f7dc0ff'],
    ['✅', '#58ac3aff', 'Ok with everything'],
    ['♾️', '#545B77', 'Infinity'],
    ['❓', '#E06469', 'Not sure'],
    ['☕', '#5C8984', 'Just want a coffee']
  ];

  function handleUsername() {
    const userInput = inputRef.current?.value || '';
    if (userInput.trim() === '') {
      alert('Please enter a username');
      return;
    }
    const name = userInput.trim();
    localStorage.setItem(roomId, name);
    setPresenceData({
      ...user,
      username: name
    });
  }

  function reveal() {
    publish('message', {
      action: 'reveal'
    });
  }

  function handleReset() {
    publish('message', {
      action: 'reset'
    });
  }

  function handleVote(vote: string) {
    if (user.vote === vote) {
      setPresenceData({
        ...user,
        vote: null
      });
    } else {
      setPresenceData({
        ...user,
        vote
      });
    }
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleUsername();
    }
  }

  const noneHasVoted = userData.every(({ vote }) => !vote);

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <IconLoader className="inline mr-2 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-20 px-2 border-b-1 border-gray-200 flex text-teal-600 text-2xl font-bold items-center">
        Play Planning Poker
      </div>
      {connectionState === 'disconnected' ? (
        <div className="py-2 text-center">
          Disconnected from the session, check your connection or refresh the
          page
        </div>
      ) : (
        <div>
          {!user.username || user.username?.length <= 0 ? (
            <div className="flex justify-center py-2">
              <div className="w-50 flex flex-col items-start gap-4">
                <div className="text-teal-600 font-bold">Join room</div>
                <input
                  onKeyDown={handleKeyPress}
                  ref={inputRef}
                  placeholder="Your username"
                  autoFocus
                  className="border-1 border-gray-200 rounded-sm focus:border-teal-500 px-2 py-1 w-full"
                />
                <button
                  className="bg-teal-600 text-white w-full rounded-sm py-1 cursor-pointer"
                  onClick={handleUsername}
                >
                  Enter
                </button>
              </div>
            </div>
          ) : (
            <div className="flex sm:flex-row py-2 px-1 flex-col xs:gap-5">
              <div className="md:w-100 p-1 sm:w-[35%] md:w-[30%]">
                <PlayerList data={userData} revealed={revealed} />
              </div>
              <div className="md:flex-1 flex flex-col gap-10">
                {revealed ? (
                  <div className="flex justify-center p-1">
                    <div className="size-100">
                      <PieChart data={userData} cards={cards} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row flex-wrap">
                    {cards.map((c, index) => {
                      const isSelected = user.vote === c[0];
                      return (
                        <div
                          key={index}
                          className="sm:w-1/3 md:w-1/3 lg:w-1/4 sm:h-30 md:h-30 lg:h-50 cursor-pointer text-4xl p-1 w-1/3 h-20"
                          onClick={() => handleVote(c[0])}
                          title={c[2] ?? ''}
                        >
                          <div
                            className={[
                              isSelected ? 'bg-teal-700' : 'bg-gray-200',
                              'w-full h-full flex justify-center items-center'
                            ].join(' ')}
                          >
                            <span
                              className={[
                                isSelected ? 'text-white' : 'text-gray-700'
                              ].join('.')}
                            >
                              {c[0]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="text-center h-30">
                  <button
                    onClick={() => (revealed ? handleReset() : reveal())}
                    disabled={noneHasVoted}
                    className="bg-teal-600 text-white w-50 h-12 font-bold rounded-sm cursor-pointer"
                  >
                    {revealed ? 'Start new round' : 'Reveal voting'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
