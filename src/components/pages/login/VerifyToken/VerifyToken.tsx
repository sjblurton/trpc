import { useRouter } from 'next/router';

type Props = {
  hash: string;
  isLoading: boolean;
  route: string | undefined;
};

const VerifyToken = ({ isLoading, route }: Props) => {
  const router = useRouter();

  if (isLoading) return <p>Verify Token...</p>;

  if (route) {
    router.push(route);
  }

  return <p>Redirecting</p>;
};

export default VerifyToken;
