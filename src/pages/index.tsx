import { AppProps } from 'next/app';

const Home = ({ Component, pageProps }: AppProps) => {
  <main>
    <Component {...pageProps} />
  </main>;
};

export default Home;
