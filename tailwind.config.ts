import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/layout.tsx",
    "./app/page.tsx",
    "./app/pdf-to-word/page.tsx",
    "./app/legal/cookie-policy/page.tsx",
    "./app/legal/privacy-policy/page.tsx",
    "./app/legal/terms-of-service/page.tsx",
    "./app/blog/page.tsx",
    "./app/contact/page.tsx",
    "./app/dashboard/page.tsx",
    "./app/dashboard/DashboardClient.tsx",
    "./app/(auth)/login/page.tsx",
    "./app/(auth)/login/LoginForm.tsx",
    "./app/(auth)/register/page.tsx",
    "./app/(auth)/register/RegisterForm.tsx",
    "./app/(auth)/reset-password/page.tsx",
    "./app/(auth)/reset-password/ResetRequestForm.tsx",
    "./app/(auth)/reset-password/[token]/page.tsx",
    "./components/Navbar.tsx",
    "./components/Footer.tsx",
    "./components/CookieConsent.tsx",
    "./components/GdprScripts.tsx",
    "./components/Container.tsx",
    "./app/contact/ContactForm.tsx",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
