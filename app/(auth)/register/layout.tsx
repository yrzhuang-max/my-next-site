// app/(auth)/register/layout.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Register | FiledocSwift',
  description: 'Create your FiledocSwift account',
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}