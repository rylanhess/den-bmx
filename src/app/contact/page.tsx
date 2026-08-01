import { headers } from 'next/headers';
import DenverContactPage from '@/components/DenverContactPage';
import ColoradoContactPage from '@/components/ColoradoContactPage';
import { isColoradoExperience } from '@/lib/coloradoTheme';

export default async function ContactPage() {
  const headersList = await headers();
  const host = headersList.get('host') ?? '';
  const pathname = headersList.get('x-pathname') ?? '/contact';
  const params = new URLSearchParams();
  if (headersList.get('x-co-contact') === '1') {
    params.set('co', '1');
  }

  if (isColoradoExperience(host, pathname, params)) {
    return <ColoradoContactPage />;
  }

  return <DenverContactPage />;
}
