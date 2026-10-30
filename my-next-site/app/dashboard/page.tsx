import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  canonical: "https://filedocswift.com/dashboard",
  openGraph: {
    url: "https://filedocswift.com/dashboard",
    type: 'website',
    locale: 'en_US',
    siteName: 'FileDocSwift',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}