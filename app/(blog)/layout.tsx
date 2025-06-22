import React from 'react';
import Link from 'next/link';
import navs from '@lib/navs';
import { Metadata } from 'next';
import Image from 'next/image';

import 'styles/global.scss';

const name = 'Thanh';
export const metadata: Metadata = {
  title: 'Green season',
  description: `Hi`
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div>
          <main className="flex p-12 gap-12">
            <nav className="w-40 flex-none flex items-center flex-col gap-5">
              <Image
                src="/images/profile.jpg"
                alt={name}
                width="100"
                height="100"
              />
              <div className="flex flex-col gap-5 font-bold">
                {navs.map((nav) => (
                  <Link href={nav.path} key={nav.path}>
                    <button className="cursor-pointer text-teal-700">
                      {nav.name}
                    </button>
                  </Link>
                ))}
              </div>
            </nav>
            <div className="flex-1">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
