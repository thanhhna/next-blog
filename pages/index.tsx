import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import Layout from 'components/Layout';
import { getSortedPostsData, PostData } from 'lib/posts';
import Date from 'components/Date';
import utilStyles from 'styles/utils.module.scss';

export async function getStaticProps(): Promise<{
  props: { allPostsData: PostData[] };
}> {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    }
  };
}

export default function Home({
  allPostsData
}: {
  allPostsData: {
    date: string;
    title: string;
    publish: boolean;
    id: string;
  }[];
}): JSX.Element {
  return (
    <Layout home>
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
    </Layout>
  );
}
