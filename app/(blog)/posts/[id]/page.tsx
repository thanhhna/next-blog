import React from 'react';
import { getAllPostIds, getPostData } from '@lib/posts';
import Date from '@components/Date';
import utilStyles from '@styles/utils.module.scss';
import styles from './posts.module.scss';

async function generateStaticParams() {
  const allPosts = await getAllPostIds();
  return allPosts;
}

export default async function Post({
  params
}: {
  params: { id: string };
}): Promise<React.ReactNode> {
  const postData = await getPostData(params.id);
  return (
    <article className={styles.article}>
      <h1 className={utilStyles.headingXl}>{postData.title}</h1>
      <div className={utilStyles.lightText}>
        <Date dateString={postData.date} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  );
}
