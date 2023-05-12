'use client';

import { notifications } from '@mantine/notifications';
import styled from '@emotion/styled';
import { configureAbly, useChannel, usePresence } from '@ably-labs/react-hooks';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Types } from 'ably';
import {
  IconClockHour8,
  IconCircleCheckFilled,
  IconDeviceGamepad,
  IconCopy
} from '@tabler/icons-react';
import {
  Button,
  Card,
  Center,
  Flex,
  Text,
  Title,
  TextInput,
  Tooltip,
  Header
} from '@mantine/core';
import { PieChart } from 'react-minimal-pie-chart';
import randomChars from 'random-chars';
import { v4 as uuid } from 'uuid';
import { useMediaQuery } from '@mantine/hooks';

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

interface UserData {
  id: string;
  username: string;
  vote: null | string;
  isOwner: boolean;
  revealed: boolean;
}

configureAbly({
  authUrl: `${window.location.origin}/api/ablyAuth`,
  clientId: 'planning-poker'
});

export default function PlanningPoker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const r = searchParams?.get('r');

  const inputRef = useRef<HTMLInputElement>(null);
  const ownerRef = useRef<boolean>(false);
  const [message, setMessage] = useState<Types.Message | null>(null);
  const [copied, setCopied] = useState(false);

  if (!r) {
    ownerRef.current = true;
  }

  const roomId = r || (randomChars.get(16) as string);

  useEffect(() => {
    if (!r) {
      router.push(`${pathname}?r=${roomId}`);
    }
  }, []);

  const initialData: UserData = {
    username: '',
    vote: null,
    isOwner: ownerRef.current,
    revealed: false,
    id: userId
  };

  const [presenceData, setData] = usePresence(roomId, initialData);

  const owner =
    presenceData.find((d) => d.data.isOwner)?.data ?? ({} as UserData);
  const user =
    presenceData.find((d) => d.data.id === userId)?.data ?? ({} as UserData);

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
      ownerRef.current = true;
    }
  }, [presenceData]);

  const [channel] = useChannel(roomId, (message) => handleMessage(message));

  function handleMessage(message: Types.Message) {
    setMessage(message);
  }

  useEffect(() => {
    if (message?.data?.action === 'reset') {
      setData({
        ...user,
        vote: null,
        revealed: false
      });
    }
  }, [message]);

  const cards = [
    ['0', '#FF6D60'],
    ['1/2', '#F7D060'],
    ['1', '#FF6D60'],
    ['2', '#F7D060'],
    ['3', '#3C486B'],
    ['5', '#87CBB9'],
    ['8', '#D14D72'],
    ['13', '#00235B'],
    ['20', '#E21818'],
    ['40', '#FFDD83'],
    ['100', '#98DFD6'],
    ['?', '#E06469']
  ];

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
    if (ownerRef.current) {
      setData({
        ...user,
        revealed: true
      });
    }
  }

  function handleReset() {
    if (ownerRef.current) {
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

  function handleCopy() {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(
      function () {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      function (err) {
        notifications.show({
          title: 'Oops',
          message: 'Could not copy to clipboard'
        });
      }
    );
  }

  const matches = useMediaQuery('(max-width: 1024px)');
  const noneHasVoted = presenceData.every(({ data }) => !data.vote);

  return (
    <>
      <Header height={{ base: 50, md: 70 }} p="md">
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Title order={3} color="teal">
            Play Planning Poker
          </Title>
        </div>
      </Header>
      <Flex direction="column" mt="md">
        {!user.username || user.username?.length <= 0 ? (
          <Center>
            <Flex direction="column" gap={20}>
              <Title order={4} color="teal">
                Join room
              </Title>
              <TextInput
                onKeyPress={handleKeyPress as any}
                ref={inputRef}
                placeholder="Your username"
                autoFocus
              />
              <Button color="teal" onClick={handleUsername}>
                Enter
              </Button>
            </Flex>
          </Center>
        ) : (
          <Flex gap={10}>
            <Flex sx={{ flexBasis: '25%' }} direction="column" p={5}>
              <Card withBorder>
                <Card.Section withBorder bg="teal.9" h={40}>
                  <Center fw={700} h={'100%'}>
                    <Flex w={'100%'}>
                      <Flex
                        pl={50}
                        sx={{ flexGrow: 1, justifyContent: 'center' }}
                      >
                        <Text color="white">Players</Text>
                      </Flex>
                      <Flex sx={{ flexBasis: '50px', cursor: 'pointer' }}>
                        <Tooltip
                          label="Link copied!"
                          position="top"
                          opened={copied}
                          openDelay={500}
                        >
                          <IconCopy color="white" onClick={handleCopy} />
                        </Tooltip>
                      </Flex>
                    </Flex>
                  </Center>
                </Card.Section>
                <Card.Section>
                  {presenceData
                    .sort((a, b) =>
                      a.data.username > b.data.username ? 1 : -1
                    )
                    .map(({ data }, index) => (
                      <Flex sx={{ alignItems: 'center' }} px={10} key={index}>
                        <Flex sx={{ flexBasis: '50px' }}>
                          {data.isOwner ? (
                            <IconDeviceGamepad
                              style={{ marginLeft: 10 }}
                              color="green"
                            />
                          ) : null}
                        </Flex>
                        <Center h={40} sx={{ flexGrow: 1 }}>
                          <Text color="teal.9" fw={600}>
                            {data.username}
                          </Text>
                        </Center>
                        <Flex
                          sx={{ flexBasis: '50px', justifyContent: 'center' }}
                        >
                          {data.vote ? (
                            owner.revealed ? (
                              <Text fw={500}>{data.vote}</Text>
                            ) : (
                              <IconCircleCheckFilled color="teal" />
                            )
                          ) : (
                            <IconClockHour8 color="gray" />
                          )}
                        </Flex>
                      </Flex>
                    ))}
                </Card.Section>
              </Card>
            </Flex>
            <Flex direction="column" sx={{ flexGrow: 1 }}>
              {owner.revealed ? (
                <Flex h={400}>
                  <PieChart
                    animate
                    label={({ dataEntry }) => dataEntry.title}
                    labelStyle={{
                      fill: 'white'
                    }}
                    data={cards
                      .filter((c) =>
                        presenceData.some((d) => d.data.vote === c[0])
                      )
                      .map((c) => ({
                        title: c[0],
                        value: presenceData.filter((d) => d.data.vote === c[0])
                          .length,
                        color: c[1]
                      }))}
                  />
                </Flex>
              ) : (
                <Flex wrap="wrap" sx={{ boxSizing: 'border-box' }}>
                  {cards.map((c, index) => {
                    const isSelected = user.vote === c[0];
                    return (
                      <Center
                        w={`${100 / (matches ? 4 : 6)}%`}
                        h={200}
                        p={5}
                        key={index}
                        fz={40}
                      >
                        <PointCard
                          w={'100%'}
                          h={'100%'}
                          bg={isSelected ? 'teal.9' : 'gray.2'}
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
              {ownerRef.current ? (
                <Center mt={30}>
                  <Button
                    size="lg"
                    color="teal.9"
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
