// app/dashboard/recharge/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successFlag = searchParams.get('success');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('Verifying your purchase…');

  useEffect(() => {
    if (successFlag !== '1') {
      router.push('/dashboard/recharge');
      return;
    }
    setMsg('Payment confirmed! Credits will be credited shortly.');
    setLoading(false);
  }, [successFlag, router]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <p className="text-lg">Verifying your purchase…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p className="text-gray-500 mb-8">{msg}</p>
      <p className="text-gray-400 text-sm mb-8">
        If your credits do not appear within a few minutes, refresh your dashboard.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700"
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => router.push('/dashboard/recharge')}
          className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          Back to Plans
        </button>
      </div>
    </div>
  );
}

export default function RechargeSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
