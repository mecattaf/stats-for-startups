import { redirect } from 'next/navigation';
import { DEFAULT_LANGUAGE } from '@/lib/i18n/config';

export default function RootPage() {
  // Redirect to the default language
  redirect(`/${DEFAULT_LANGUAGE}`);
}
