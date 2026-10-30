import type { Metadata } from 'next';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  canonical: "https://filedocswift.com/register",
  openGraph: {
    url: "https://filedocswift.com/register",
    type: 'website',
    locale: 'en_US',
    siteName: 'FileDocSwift',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}