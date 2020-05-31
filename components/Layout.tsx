import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import cn from 'classnames';
import GoTop from './GoTop';
import navs from 'lib/navs';
import styles from './Layout.module.scss';
import utilStyles from 'styles/utils.module.scss';

const name = 'Thanh';
export const siteTitle = 'Green season';

function Layout(
  {
    children,
    home = false,
    title = siteTitle
  }: {
    children: React.ReactNode,
    home?: boolean,
    title?: string
  }
) {
  return (
    <div className={styles.container}>
      <Head>
        <link ref="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={`Thanh Nguyen's personal site.`}
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.0/styles/solarized-light.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap" rel="stylesheet" />

        {title &&
          (
            <title>{title}</title>
          ) 
        }
      </Head>
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
        <nav className={cn(styles.nav, utilStyles.textCenter)}>
          <img
            src="/images/profile.jpg" 
            className={cn(styles.headerHomeImage, utilStyles.borderCircle)}
            alt={name}
          />
          <h1 className={utilStyles.headingLg}>{name}</h1>
          <div className={styles.link}>
            {navs.map(nav => (
              <Link href={nav.path} key={nav.path}>
                <button
                  className={cn(utilStyles.textBold, utilStyles.link, utilStyles.headingNm)}
                >
                  {nav.name}
                </button>
              </Link>
            ))}
          </div>
        </nav>
      </main>
      <GoTop />
    </div>
  );
}

export default Layout;