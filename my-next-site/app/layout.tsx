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

        <Script
          id="ga4-ads-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      function isGoogleBot() {
        const ua = navigator.userAgent.toLowerCase();
        return ua.includes('googlebot')
          || ua.includes('adsbot-google')
          || ua.includes('mediapartners-google');
      }
              function loadGA(){
                const script = document.createElement('script');
                script.src = 'https://www.googletagmanager.com/gtag/js?id=G-FTLGHYG3WH';
                script.async = true;
                document.head.appendChild(script);
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-FTLGHYG3WH');
              }
              function loadAdsense(){
                const adsScript = document.createElement('script');
                adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2652696013507160';
                adsScript.crossOrigin="anonymous";
                adsScript.async = true;
                document.head.appendChild(adsScript);
              }
              function loadTracking(){
                loadGA();
                loadAdsense();
              }
              // 如果是谷歌爬虫，直接加载广告脚本，用于审核
              if(isGoogleBot()){
                loadAdsense();
              }
              // 普通访客：判断cookie同意状态
const savedConsent = typeof localStorage !== 'undefined' ? localStorage.getItem("cookieConsent") : null;
if(savedConsent === "accepted"){
  loadTracking();
}else{
  window.addEventListener('cookieConsentAccepted', loadTracking, {once:true, passive:true});
}
            `,
          }}
        />
      </body>
    </html>
  );
}