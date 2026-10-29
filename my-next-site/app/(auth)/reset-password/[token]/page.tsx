// app/(auth)/reset-password/[token]/page.tsx
export const dynamic = 'force-dynamic';
import ResetForm from './ResetForm';

export default function ResetConfirmPage() {
  return <ResetForm />;
}