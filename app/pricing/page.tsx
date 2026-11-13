// D:\my-next-site\app\pricing\page.tsx
'use client';

import { useEffect, useState } from 'react';

const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_SANDBOX_CLIENT_TOKEN!;
const SUCCESS_URL = 'https://filedocswift.com/dashboard?paid=success';
const CANCEL_URL = 'https://filedocswift.com/pricing?paid=cancel';

const plans = [
  {
    priceId: 'pri_01m6p2kbqc7cvvxnesyqmwmjhk',
    name: 'Points Pack',
    credit: 150,
    type: 'one_time',
  },
  {
    priceId: 'pri_01m6ncgte7p2cxqpd3257y993p',
    name: 'Pro Monthly',
    credit: 300,
    type: 'monthly',
  },
  {
    priceId: 'pri_01m6ncmydmh0s8pg37prtkjbkp',
    name: 'Pro Yearly',
    credit: 3600,
    type: 'yearly',
  },
];

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);
  const [paddleReady, setPaddleReady] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    setMounted(true);

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Environment.set('sandbox');
        window.Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN });
        setPaddleReady(true);
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleBuy = async (priceId: string) => {
    if (!paddleReady || !window.Paddle) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      window.location.href = '/login';
      return;
    }

    setLoadingId(priceId);
    try {
      const res = await fetch(`${base}/api/paddle/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price_id: priceId }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt);
      }
      const data = await res.json();

      window.Paddle.Checkout.open({
        transactionId: data.transaction_id,
        successUrl: SUCCESS_URL,
        cancelUrl: CANCEL_URL,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to create checkout');
    } finally {
      setLoadingId(null);
    }
  };

  if (!mounted) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">Pricing</h1>
      <p className="text-center text-gray-600 mb-10">Select a plan to get credits</p>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.priceId} className="border rounded p-6">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-600 my-2">{p.credit} credits</p>
            <p className="text-sm text-gray-500 mb-4">{p.type}</p>
            <button
              onClick={() => handleBuy(p.priceId)}
              disabled={loadingId === p.priceId || !paddleReady}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
            >
              {loadingId === p.priceId ? 'Processing…' : 'Buy Now'}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
