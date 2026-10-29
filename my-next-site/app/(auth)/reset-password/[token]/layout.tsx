// app/(auth)/reset-password/[token]/layout.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Set New Password | FiledocSwift',
  description: 'Set a new password using your reset token',
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
