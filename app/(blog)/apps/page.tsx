import React from 'react';
import Link from 'next/link';
import cn from '@lib/classnames';

import styles from './index.module.scss';
import utilStyles from '@styles/utils.module.scss';

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
    <div className={styles.apps}>
      <h2 className={utilStyles.headingLg}>Apps</h2>
      <p>I occasionally build small apps. Check them out.</p>
      <ul className={utilStyles.list}>
        {apps.map((app) => (
          <li className={utilStyles.listItem} key={app.path}>
            <Link href={`/apps/${app.path}`} as={`/apps/${app.path}`}>
              <button
                className={cn(
                  utilStyles.link,
                  utilStyles.headingMd,
                  styles.link
                )}
              >
                {app.name}
              </button>
            </Link>
            <p>{app.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
