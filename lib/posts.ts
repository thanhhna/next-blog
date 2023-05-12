import fs from 'node:fs/promises';
import path from 'path';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import hl from 'highlight.js';
import 'highlight.js/styles/base16/solarized-light.css';

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
  const fileContents = await fs.readFile(fullPath, 'utf8');

  const md = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hl.getLanguage(lang)) {
        return hl.highlight(str, { language: lang }).value;
      }
      return '';
    }
  });

  const matterData = matter(fileContents);
  const contentHtml = md.render(matterData.content);

  return {
    id,
    contentHtml,
    ...matterData.data
  } as PostDataWithHtml;
}

export async function getAllPostIds(): Promise<{ id: string }[]> {
  const fileNames = await fs.readdir(postsDirectory);

  return fileNames.map((fileName) => ({
    id: fileName.replace(/\.md$/, '')
  }));
}

export async function getSortedPostsData(): Promise<PostData[]> {
  const fileNames = await fs.readdir(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, '');

      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, 'utf8');

      const matterResults = matter(fileContents);

      return {
        id,
        ...matterResults.data
      } as PostData;
    })
  );

  return allPostsData
    .filter((p) => p.publish)
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      }
      return -1;
    });
}
