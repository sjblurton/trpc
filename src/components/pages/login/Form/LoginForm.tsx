import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RequestOtpInput, requestOtpSchema } from 'schema/user.schema';
import { trpc } from 'utils/trpc';

import VerifyToken from '../VerifyToken/VerifyToken';
import useVerifyToken from './hooks/useVerifyToken';

const LoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RequestOtpInput>({
    resolver: zodResolver(requestOtpSchema),
  });
  const [success, setSuccess] = useState(false);
  const { hash, isLoading, route } = useVerifyToken();

  const { mutate, error } = trpc.useMutation(["users.request-otp"], {
    onSuccess: () => setSuccess(true),
  });

  const onSubmit = (data: RequestOtpInput) => mutate(data);

  if (hash)
    return <VerifyToken hash={hash} isLoading={isLoading} route={route} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {success && <p>OTP sent to your email.</p>}
      <h1>Login</h1>
      <input
        type="email"
        placeholder="jane.doe@email.com"
        {...register("email")}
      />
      {errors.email?.message && <p>{errors.email?.message}</p>}
      <button type="submit">Login</button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

export default LoginForm;
