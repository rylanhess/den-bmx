import { getCategoryStats } from '@/lib/forum';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = { title: 'Sign In' };

export default async function LoginPage() {
  const categories = await getCategoryStats();

  return (
    <AuthPageLayout categories={categories}>
      <LoginForm />
    </AuthPageLayout>
  );
}
