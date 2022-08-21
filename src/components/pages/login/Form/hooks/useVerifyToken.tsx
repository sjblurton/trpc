import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';

const useVerifyToken = () => {
  const [hash, setHash] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    setHash(router.asPath.split("#token=")[1]);
  }, [router.asPath]);

  useEffect(() => {
    if (hash) {
      const { isLoading, data } = trpc.useQuery(["users.verify-otp", { hash }]);
      setIsLoading(isLoading);
      setRoute(data?.redirect.includes("login") ? "/" : data?.redirect || "/");
    }
  }, [hash]);

  return { hash, isLoading, route };
};

export default useVerifyToken;
