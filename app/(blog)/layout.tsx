import React from 'react';
import Link from 'next/link';
import cn from '@lib/classnames';
import navs from '@lib/navs';
import styles from './Layout.module.scss';
import utilStyles from '@styles/utils.module.scss';
import { Metadata } from 'next';
import '@styles/global.scss';
import Image from 'next/image';
import RootStyleRegistry from '@lib/emotion';
import Clicky from '@lib/clicky';

const name = 'Thanh';
export const metadata: Metadata = {
  title: 'Green season',
  description: `Thanh Nguyen's personal site.`
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html>
      <head>
        <Clicky />
      </head>
      <body>
        <div className={styles.container}>
          <main className={styles.main}>
            <nav className={cn(styles.nav, utilStyles.textCenter)}>
              <Image
                src="/images/profile.jpg"
                className={cn(styles.headerHomeImage, utilStyles.borderCircle)}
                alt={name}
                width="100"
                height="100"
              />
              <div className={styles.link}>
                {navs.map((nav) => (
                  <Link href={nav.path} key={nav.path}>
                    <button
                      className={cn(
                        utilStyles.textBold,
                        utilStyles.link,
                        utilStyles.headingNm
                      )}
                    >
                      {nav.name}
                    </button>
                  </Link>
                ))}
              </div>
            </nav>
            <div className={styles.content}>
              <RootStyleRegistry>{children}</RootStyleRegistry>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
