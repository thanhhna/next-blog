import React from 'react';
import { getAllPostIds, getPostData } from '@lib/posts';
import Date from '@components/Date';

async function generateStaticParams() {
  const allPosts = await getAllPostIds();
  return allPosts;
}

export default async function Post({params}: {params: any}): Promise<React.ReactNode> {
  const { id } = await params;
  const postData = await getPostData(id);
  return (
    <div className="flex justify-center">
      <article className="prose">
        <h1>{postData.title}</h1>
        <div>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </div>
  );
}
