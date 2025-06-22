'use client';

import {
  IconCircleCheckFilled,
  IconClockHour8,
  IconDeviceGamepad
} from '@tabler/icons-react';
import React from 'react';
import { UserData } from '@features/planningPoker/types';

export default function PlayerList({
  data,
  revealed
}: {
  data: UserData[];
  revealed: boolean;
}) {
  return (
    <div className="border-1 border-gray-200 rounded-sm">
      <div className="text-white bg-teal-600 h-10 flex items-center justify-center font-bold">
        <div className="text-center">Players</div>
      </div>
      <div>
        {data
          .filter((d) => d.username && d.username !== '')
          .map((data, index) => (
            <div className="flex items-center h-10" key={index}>
              <div className="w-12 flex-none">
                <IconDeviceGamepad style={{ marginLeft: 10 }} color="teal" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-teal-700 text-center font-bold">
                  {data.username}
                </span>
              </div>
              <div className="w-12 flex-none flex justify-center">
                {data.vote ? (
                  revealed ? (
                    <span className="font-bold">{data.vote}</span>
                  ) : (
                    <IconCircleCheckFilled color="teal.7" />
                  )
                ) : (
                  <IconClockHour8 color="gray" />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
