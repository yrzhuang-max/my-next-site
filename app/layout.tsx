import Script from 'next/script'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CookieConsent from '../components/CookieConsent'
import GdprScripts from '../components/GdprScripts'
import { AuthProvider } from '@/lib/AuthContext'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 引入 tailwind-cli 预编译输出的静态CSS，不再走Next内置CSS loader */}
        <link rel="stylesheet" href="/tailwind.css" />
      </head>
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

        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CookieConsent />
          <GdprScripts />
        </AuthProvider>
      </body>
    </html>
  )
}
