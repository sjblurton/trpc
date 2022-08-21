import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { CreateUserInput, createUserSchema } from 'schema/user.schema';
import { trpc } from 'utils/trpc';

const RegisterPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(["users.register-user"], {
    onSuccess: () => router.push("/login"),
  });

  const onSubmit = (data: CreateUserInput) => mutate(data);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Register</h1>
        <input
          type="email"
          placeholder="jane.doe@email.com"
          {...register("email")}
        />
        {errors.email?.message && <p>{errors.email?.message}</p>}
        <input type="text" placeholder="Jane Doe" {...register("name")} />
        {errors.name?.message && <p>{errors.name?.message}</p>}
        <button type="submit">Register</button>
        {error && <p>{error.message}</p>}
      </form>
      <Link href="/login">Login</Link>
    </>
  );
};

export default RegisterPage;
