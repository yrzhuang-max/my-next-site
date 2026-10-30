import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import GdprScripts from './components/GdprScripts'
import { Script } from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* 先给谷歌初始默认拒绝：必须放在最前面 */}
        <Script id="gtag-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>

        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <GdprScripts />
      </body>
    </html>
  );
}