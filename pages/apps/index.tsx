import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import Layout from 'components/Layout';
import utilStyles from 'styles/utils.module.scss';

const apps = [
  {
    name: 'Gomoku',
    path: 'gomoku'
  }
];

export default function Apps() {
  return (
    <Layout title="My Apps">
      <p>
        I occasionally build small apps.
      </p>
      <p>
        Check them out if you like.
      </p>
      <ul className={utilStyles.list}>
        {apps.map(app => (
          <li className={utilStyles.listItem} key={app.path}>
            <Link href={`/apps/${app.path}`} as={`/apps/${app.path}`}>
              <button className={cn(utilStyles.link, utilStyles.headingMd)}>
                {app.name}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}