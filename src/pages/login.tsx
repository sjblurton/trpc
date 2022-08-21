import LoginForm from 'components/pages/login/Form/LoginForm';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <>
      <LoginForm />
      <Link href="/register">Register</Link>
    </>
  );
};

export default LoginPage;
