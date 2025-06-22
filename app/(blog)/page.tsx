import React from 'react';
import Link from 'next/link';

import { getSortedPostsData, PostData } from '@lib/posts';
import Date from '@components/Date';

export default async function Home(): Promise<React.ReactNode> {
  const allPostsData: PostData[] = await getSortedPostsData();
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-stone-600 font-bold text-2xl">Posts</h2>
      <ul className="flex flex-col gap-4">
        {allPostsData.map(({ id, date, title }) => (
          <li>
            <Link href="/posts/[id]" as={`/posts/${id}`}>
              <button className="cursor-pointer font-bold">
                {title}
              </button>
            </Link>
            <br />
            <small className="text-stone-500">
              <Date dateString={date} />
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}
