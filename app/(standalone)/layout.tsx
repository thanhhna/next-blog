import React from 'react';
import RootStyleRegistry from '@lib/emotion';
import Clicky from '@lib/clicky';

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
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  );
}
