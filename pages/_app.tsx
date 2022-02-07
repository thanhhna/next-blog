import React from 'react';
import { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import 'styles/global.scss';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}
