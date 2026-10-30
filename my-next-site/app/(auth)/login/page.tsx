import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  canonical: "https://filedocswift.com/login",
  openGraph: {
    url: "https://filedocswift.com/login",
    type: 'website',
    locale: 'en_US',
    siteName: 'FileDocSwift',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginForm />;
}