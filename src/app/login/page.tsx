import { getCategoryStats } from '@/lib/forum';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to BMX Colorado to post on the statewide BMX message boards.',
  robots: { index: false, follow: true },
};

export default async function LoginPage() {
  const categories = await getCategoryStats();

  return (
    <AuthPageLayout categories={categories}>
      <LoginForm />
    </AuthPageLayout>
  );
}
