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
        <meta name="og:title" content={siteTitle} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.0/styles/solarized-light.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap" rel="stylesheet" />

        {
          process.env.NODE_ENV === 'production' ? (
            <> 
              <script>var clicky_site_ids = clicky_site_ids || []; clicky_site_ids.push(101231340);</script>
              <script async src="//static.getclicky.com/js"></script>    
            </>
          ) : null
        }

        {title &&
          (
            <title>{title}</title>
          ) 
        }
      </Head>
      <main className={styles.main}>
        <nav className={cn(styles.nav, utilStyles.textCenter)}>
          <img
            src="/images/profile.jpg" 
            className={cn(styles.headerHomeImage, utilStyles.borderCircle)}
            alt={name}
          />
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
        <div className={styles.content}>{children}</div>
      </main>
      <GoTop />
    </div>
  );
}

export default Layout;