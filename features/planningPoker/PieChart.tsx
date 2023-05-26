'use client';

import React from 'react';
import { PieChart as MinimalPieChart } from 'react-minimal-pie-chart';
import { UserData } from '@features/planningPoker/PlanningPoker';

export default function PieChart({
  data,
  cards
}: {
  data: UserData[];
  cards: [string, string][];
}) {
  const pieChartData = cards
    .filter((c) => data.some((d) => d.vote === c[0]))
    .map((c) => ({
      title: c[0],
      value: data.filter((d) => d.vote === c[0]).length,
      color: c[1]
    }));
  return (
    <MinimalPieChart
      animate
      labelPosition={70}
      label={({ dataEntry, x, y, dx, dy }) => (
        <>
          <text
            x={x}
            y={y}
            dx={dx}
            dy={dy}
            dominantBaseline="central"
            textAnchor="middle"
            style={{
              fontSize: '10px',
              fill: 'white'
            }}
          >
            {dataEntry.title}
          </text>
          <text
            y={y + 2}
            x={
              x +
              (parseInt(dataEntry.title, 10) >= 10
                ? parseInt(dataEntry.title, 10) >= 100
                  ? 14
                  : 10
                : 8)
            }
            dx={dx}
            dy={dy}
            dominantBaseline="central"
            textAnchor="middle"
            style={{ fontSize: '5px', fill: 'white' }}
          >
            - {dataEntry.value}
          </text>
        </>
      )}
      data={pieChartData}
    />
  );
}
