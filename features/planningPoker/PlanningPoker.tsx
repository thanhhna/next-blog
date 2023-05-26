'use client';

import { notifications } from '@mantine/notifications';
import styled from '@emotion/styled';
import { configureAbly, useChannel, usePresence } from '@ably-labs/react-hooks';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Types } from 'ably';
import {
  Button,
  Center,
  Flex,
  Text,
  Title,
  TextInput,
  Header,
  createStyles
} from '@mantine/core';
import randomChars from 'random-chars';
import { v4 as uuid } from 'uuid';
import PieChart from '@features/planningPoker/PieChart';
import PlayerList from '@features/planningPoker/PlayerList';

const PointCard = styled(Flex)`
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 3px -2px;
    cursor: pointer;
    transform: scale(1.05);
  }
`;

const userId = uuid();

export interface UserData {
  id: string;
  username: string;
  vote: null | string;
  isOwner: boolean;
  revealed: boolean;
}

const useStyles = createStyles((theme) => ({
  main: {
    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column'
    }
  },
  pointCard: {
    [theme.fn.smallerThan('xs')]: {
      width: `100%`
    },
    [(theme.fn.smallerThan('md'), theme.fn.largerThan('xs'))]: {
      width: `${100 / 2}%`
    },
    [theme.fn.largerThan('md')]: {
      width: `${100 / 4}%`
    },
    [theme.fn.largerThan('lg')]: {
      width: `${100 / 6}%`
    }
  }
}));

export default function PlanningPoker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const r = searchParams?.get('r');

  configureAbly({
    authUrl: `${window.location.origin}/api/ablyAuth`,
    disconnectedRetryTimeout: 5000,
    suspendedRetryTimeout: 5000
  });

  const styles = useStyles();

  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<Types.Message | null>(null);
  const [offline, setOffline] = useState(false);

  const roomId = r || (randomChars.get(16) as string);

  const initialData: UserData = {
    username: '',
    vote: null,
    isOwner: !r,
    revealed: false,
    id: userId
  };

  const [presenceData, setData] = usePresence(roomId, initialData);
  const [channel, ably] = useChannel(roomId, (message) =>
    handleMessage(message)
  );

  const userData = presenceData
    .filter(({ data }) => data.username !== '')
    .sort((a, b) => (a.data.username > b.data.username ? 1 : -1))
    .map((d) => d.data);
  const owner = userData.find((d) => d.isOwner) ?? ({} as UserData);
  const user = userData.find((d) => d.id === userId) ?? ({} as UserData);

  ably.connection.on('connected', () => {
    if (offline && user.isOwner) {
      setData({
        ...user,
        isOwner: false
      });
      setOffline(false);
    }
  });

  useEffect(() => {
    if (!r) {
      router.push(`${pathname}?r=${roomId}`);
    }
  }, []);

  useEffect(() => {
    if (
      !owner.id &&
      user.id &&
      presenceData.findIndex((d) => d.data.id === userId) === 0
    ) {
      setData({
        ...user,
        isOwner: true
      });
    }
  }, [presenceData]);

  useEffect(() => {
    if (message?.data?.action === 'reset') {
      setData({
        ...user,
        vote: null,
        revealed: false
      });
    }
  }, [message]);

  useEffect(() => {
    const handleOffline = () => {
      setOffline(true);
    };
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cards: [string, string][] = [
    ['0', '#FF6D60'],
    ['1/2', '#F7D060'],
    ['1', '#FF6D60'],
    ['2', '#F7D060'],
    ['3', '#3C486B'],
    ['5', '#87CBB9'],
    ['8', '#D14D72'],
    ['13', '#00235B'],
    ['20', '#E8AA42'],
    ['40', '#FFDD83'],
    ['100', '#98DFD6'],
    ['∞', '#545B77'],
    ['?', '#E06469'],
    ['☕', '#5C8984']
  ];

  function handleMessage(message: Types.Message) {
    setMessage(message);
  }

  function handleUsername() {
    const userInput = inputRef.current?.value || '';
    if (userInput.trim() === '') {
      notifications.show({
        title: 'Oops',
        message: 'Please enter username',
        color: 'orange'
      });
      return;
    }
    const name = userInput.trim();
    setData({
      ...initialData,
      username: name
    });
  }

  function reveal() {
    if (user.isOwner) {
      setData({
        ...user,
        revealed: true
      });
    }
  }

  function handleReset() {
    if (user.isOwner) {
      channel.publish('message', {
        action: 'reset'
      });
    }
  }

  function handleVote(vote: string) {
    setData({
      ...user,
      vote
    });
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      handleUsername();
    }
  }

  const noneHasVoted = userData.every(({ vote }) => !vote);

  return (
    <>
      <Header height={{ base: 50, md: 70 }} p="md">
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Title order={3} color="teal.7">
            Play Planning Poker
          </Title>
        </div>
      </Header>
      <Flex direction="column" mt="md">
        {!user.username || user.username?.length <= 0 ? (
          <Center>
            <Flex direction="column" gap={20}>
              <Title order={4} color="teal.7">
                Join room
              </Title>
              <TextInput
                onKeyPress={handleKeyPress as any}
                ref={inputRef}
                placeholder="Your username"
                autoFocus
              />
              <Button color="teal.7" onClick={handleUsername}>
                Enter
              </Button>
            </Flex>
          </Center>
        ) : (
          <Flex gap={10} className={styles.classes.main}>
            <Flex sx={{ flexBasis: '25%' }} direction="column" p={5}>
              <PlayerList data={userData} />
            </Flex>
            <Flex direction="column" sx={{ flexGrow: 1 }}>
              {owner.revealed ? (
                <Flex h={400} gap="xl">
                  <PieChart data={userData} cards={cards} />
                </Flex>
              ) : (
                <Flex wrap="wrap" sx={{ boxSizing: 'border-box' }}>
                  {cards.map((c, index) => {
                    const isSelected = user.vote === c[0];
                    return (
                      <Center
                        h={200}
                        p={5}
                        key={index}
                        fz={40}
                        className={styles.classes.pointCard}
                      >
                        <PointCard
                          w={'100%'}
                          h={'100%'}
                          bg={isSelected ? 'teal.7' : 'gray.2'}
                          onClick={() => handleVote(c[0])}
                        >
                          <Text color={isSelected ? 'white' : 'gray.7'}>
                            {c[0]}
                          </Text>
                        </PointCard>
                      </Center>
                    );
                  })}
                </Flex>
              )}
              {user.isOwner ? (
                <Center mt={30}>
                  <Button
                    size="lg"
                    color="teal.7"
                    onClick={() => (owner.revealed ? handleReset() : reveal())}
                    disabled={noneHasVoted}
                  >
                    {owner.revealed ? 'Start new round' : 'Reveal voting'}
                  </Button>
                </Center>
              ) : null}
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  );
}
