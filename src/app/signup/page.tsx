import { getCategoryStats } from '@/lib/forum';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import SignupForm from '@/components/auth/SignupForm';

export const metadata = {
  title: 'Create Account',
  description:
    "Join BMX Colorado — the statewide message board for BMX racing, freestyle, and track news.",
  robots: { index: false, follow: true },
};

export default async function SignupPage() {
  const categories = await getCategoryStats();

  return (
    <AuthPageLayout categories={categories}>
      <SignupForm />
    </AuthPageLayout>
  );
}
