import type { Metadata } from 'next';
import ResetRequestForm from './ResetRequestForm';

export const metadata: Metadata = {
  alternates: {
  canonical: "https://filedocswift.com/reset-password",
  },
  openGraph: {
    url: "https://filedocswift.com/reset-password",
    type: 'website',
    locale: 'en_US',
    siteName: 'FileDocSwift',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ResetRequestPage() {
  return <ResetRequestForm />;
}