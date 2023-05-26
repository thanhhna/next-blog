'use client';

import { Card, Center, Flex, Tooltip, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconCircleCheckFilled,
  IconClockHour8,
  IconCopy,
  IconDeviceGamepad
} from '@tabler/icons-react';
import React, { useState } from 'react';
import { UserData } from '@features/planningPoker/PlanningPoker';

export default function PlayerList({ data }: { data: UserData[] }) {
  const [copied, setCopied] = useState(false);

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
  const owner = data.find((d) => d.isOwner) ?? ({} as UserData);

  return (
    <Card withBorder>
      <Card.Section withBorder bg="teal.7" h={40}>
        <Center fw={700} h={'100%'}>
          <Flex w={'100%'}>
            <Flex pl={50} sx={{ flexGrow: 1, justifyContent: 'center' }}>
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
        {data
          .filter((d) => d.username && d.username !== '')
          .map((data, index) => (
            <Flex sx={{ alignItems: 'center' }} px={10} key={index}>
              <Flex sx={{ flexBasis: '50px' }}>
                {data.isOwner ? (
                  <IconDeviceGamepad style={{ marginLeft: 10 }} color="teal" />
                ) : null}
              </Flex>
              <Center h={40} sx={{ flexGrow: 1 }}>
                <Text color="teal.7" fw={600}>
                  {data.username}
                </Text>
              </Center>
              <Flex sx={{ flexBasis: '50px', justifyContent: 'center' }}>
                {data.vote ? (
                  owner.revealed ? (
                    <Text fw={500}>{data.vote}</Text>
                  ) : (
                    <IconCircleCheckFilled color="teal.7" />
                  )
                ) : (
                  <IconClockHour8 color="gray" />
                )}
              </Flex>
            </Flex>
          ))}
      </Card.Section>
    </Card>
  );
}
