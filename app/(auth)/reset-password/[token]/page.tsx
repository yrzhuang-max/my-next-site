import { Suspense } from 'react';
import ResetForm from './ResetForm';
import type { Metadata } from 'next';

type Props = { 
  params: Promise<{ token: string }> 
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const canonicalUrl = `https://filedocswift.com/reset-password/${token}`;
  return {
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      type: 'website',
      locale: 'en_US',
      siteName: 'FileDocSwift',
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ResetConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetForm />
    </Suspense>
  );
}
