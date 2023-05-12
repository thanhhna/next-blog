import React from 'react';
import Link from 'next/link';
import cn from '@lib/classnames';

import { getSortedPostsData, PostData } from '@lib/posts';
import Date from '@components/Date';
import utilStyles from '@styles/utils.module.scss';

export default async function Home(): Promise<React.ReactNode> {
  const allPostsData: PostData[] = await getSortedPostsData();
  return (
    <section className={cn(utilStyles.headingMd)}>
      <h2 className={utilStyles.headingLg}>Posts</h2>
      <ul className={utilStyles.list}>
        {allPostsData.map(({ id, date, title }) => (
          <li className={cn(utilStyles.listItem)} key={id}>
            <Link href="/posts/[id]" as={`/posts/${id}`}>
              <button className={cn(utilStyles.link, utilStyles.headingMd)}>
                {title}
              </button>
            </Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}
