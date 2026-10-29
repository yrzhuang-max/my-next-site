// app/(auth)/login/layout.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Login | FiledocSwift',
  description: 'Sign into your FiledocSwift account',
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
