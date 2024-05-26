import Head from 'next/head';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/robot_flat.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  );  
}

export default MyApp;