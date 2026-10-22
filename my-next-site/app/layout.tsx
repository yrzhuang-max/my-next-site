import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: {
    default: 'FileDocSwift | Free Online Document Converter',
    template: '%s | FileDocSwift',
  },
  description: 'Free online PDF to Word converter. Convert PDF to editable DOCX quickly, no registration required.',
  metadataBase: new URL('https://www.filedocswift.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'FileDocSwift',
    url: 'https://www.filedocswift.com',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-800">
        <Header />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <CookieBanner />
        {/* Vercel Web Analytics，无Cookie，直接启用，不需要用户授权 */}
        <Analytics />
        {/* GA4 脚本，延迟加载，等用户同意cookie才执行 */}
        <Script
          id="ga4-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('cookieConsentAccepted', function() {
                // 替换成你的GA4 MEASUREMENT ID G-XXXXXXX
                const script = document.createElement('script');
                script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YOUR_GA_ID';
                script.async = true;
                document.head.appendChild(script);
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-YOUR_GA_ID');
              })
            `,
          }}
        />
        {/* AdSense广告脚本，用户同意Cookie才加载 */}
        <Script
          id="adsense-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('cookieConsentAccepted', function() {
                const adsScript = document.createElement('script');
                adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUB_ID';
                adsScript.crossOrigin="anonymous";
                adsScript.async = true;
                document.head.appendChild(adsScript);
              })
            `,
          }}
        />
      </body>
    </html>
  );
}
