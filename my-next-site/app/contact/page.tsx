import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  canonical: "https://filedocswift.com/contact",
  openGraph: {
    url: "https://filedocswift.com/contact",
    type: 'website',
    locale: 'en_US',
    siteName: 'FileDocSwift',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactForm />;
}