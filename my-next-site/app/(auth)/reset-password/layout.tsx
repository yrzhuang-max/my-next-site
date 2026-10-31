// app/(auth)/reset-password/layout.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Reset Password | FiledocSwift',
  description: 'Request a password reset link',
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
