import React from 'react';
import Link from 'next/link';

const apps = [
  // {
  //   name: 'Gomoku',
  //   path: 'gomoku',
  //   description: 'A bigger version of Tic-tac-toe'
  // },
  // {
  //   name: 'Sequence',
  //   path: 'sequence',
  //   description:
  //     'Select numbers by order from smaller to bigger where number is placed randomly in a sheet'
  // },
  {
    name: 'Planning Poker',
    path: 'planning-poker',
    description: 'Planning Poker game for Scrum team'
  }
];

export default function Apps() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-stone-600 text-2xl">Apps</h2>
      <ul>
        {apps.map((app, index) => (
          <li className="flex flex-col gap-4" key={index}>
            <Link href={`/apps/${app.path}`} as={`/apps/${app.path}`}>
              <button className="cursor-pointer font-bold">
                {app.name}
              </button>
            </Link>
            <p className="text-stone-500">{app.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
