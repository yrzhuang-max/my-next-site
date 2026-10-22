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
        <Analytics />

        {/* GA4 脚本：等待cookie同意，同时兼容历史已同意状态 */}
        <Script
          id="ga4-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function loadGA(){
                const script = document.createElement('script');
                script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YOUR_GA_ID';
                script.async = true;
                document.head.appendChild(script);
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-YOUR_GA_ID');
              }
              function loadAdsense(){
                const adsScript = document.createElement('script');
                adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUB_ID';
                adsScript.crossOrigin="anonymous";
                adsScript.async = true;
                document.head.appendChild(adsScript);
              }
              function loadTracking(){
                loadGA();
                loadAdsense();
              }
              // 页面加载时，检查localStorage是否已经同意cookie
              if(localStorage.getItem("cookieConsent") === "accepted"){
                loadTracking();
              }else{
                // 用户点击同意后触发
                window.addEventListener('cookieConsentAccepted', loadTracking, {once:true});
              }
            `,
          }}
        />
      </body>
    </html>
  );
}