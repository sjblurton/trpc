import { trpc } from '../utils/trpc';

import type { NextPage } from "next";
const Home: NextPage = () => {
  const { data, error, isLoading } = trpc.useQuery(["hello"]);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;
  return <div>{JSON.stringify(data)}</div>;
};

export default Home;
