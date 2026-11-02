'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RechargeSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard/recharge');
      return;
    }
    // 可选：拉取订单信息确认（后端接口后续补齐）
    setLoading(false);
  }, [sessionId, router]);

  if (loading) return <div className="p-12 text-center">Verifying payment...</div>;

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-center">
      <div className="text-green-600 text-5xl mb-4">✓</div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p className="text-gray-600 mb-8">
        Your OCR credits have been added to your account. Credits are ready for scanned PDF conversions.
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => router.push('/dashboard/recharge')}
          className="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50"
        >
          Buy more credits
        </button>
      </div>
    </main>
  );
}
