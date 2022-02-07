import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import highlight from 'remark-highlight.js';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: string;
  date: string;
  title: string;
  publish: boolean;
}

interface PostDataWithHtml extends PostData {
  contentHtml: string;
}

export async function getPostData(id: string): Promise<PostDataWithHtml> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(highlight)
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data
  } as PostDataWithHtml;
}

export function getAllPostIds(): { params: { id: string } }[] {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, '')
    }
  }));
}

export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResults = matter(fileContents);

    return {
      id,
      ...matterResults.data
    } as PostData;
  });

  return allPostsData
    .filter((p) => p.publish)
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      }
      return -1;
    });
}
