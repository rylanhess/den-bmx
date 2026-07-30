import { getCategoryStats } from '@/lib/forum';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import SignupForm from '@/components/auth/SignupForm';

export const metadata = { title: 'Create Account' };

export default async function SignupPage() {
  const categories = await getCategoryStats();

  return (
    <AuthPageLayout categories={categories}>
      <SignupForm />
    </AuthPageLayout>
  );
}
