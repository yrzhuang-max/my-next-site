'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type PackageKey = 'pack_5' | 'pack_10' | 'pack_50';

interface CreditPackage {
  key: PackageKey;
  credits: number;
  price: string;
  description: string;
}

const packages: CreditPackage[] = [
  {
    key: 'pack_5',
    credits: 5,
    price: '$1.99',
    description: 'For occasional OCR conversions',
  },
  {
    key: 'pack_10',
    credits: 10,
    price: '$2.99',
    description: 'Great for regular light usage',
  },
  {
    key: 'pack_50',
    credits: 50,
    price: '$9.99',
    description: 'Best value for frequent OCR work',
  },
];

export default function RechargePage() {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = useState<PackageKey | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleBuy = async (pkgKey: PackageKey) => {
    setErrorMsg('');
    setLoadingKey(pkgKey);
    try {
      if (!base) {
        throw new Error('API base url not configured');
      }
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }
      const res = await fetch(`${base}/api/recharge/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ packageKey: pkgKey }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server returned HTML instead of JSON, status ${res.status}`);
      }
      if (!res.ok || !data.ok) {
        throw new Error(data.msg || 'Failed to create checkout session');
      }
      router.push(data.checkoutUrl);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Buy OCR Conversion Credits</h1>
        <p className="text-gray-600">
          Credits are permanent and never expire. 1 credit = 1 OCR scanned PDF conversion.
          <br />
          If you have an active Pro subscription, OCR usage consumes your Pro daily quota first, not credits.
        </p>
      </>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.key}
            className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold">{pkg.credits} OCR Credits</h2>
            <div className="text-2xl font-bold my-4">{pkg.price}</div>
            <p className="text-gray-500 text-sm mb-6">{pkg.description}</p>
            <button
              onClick={() => handleBuy(pkg.key)}
              disabled={loadingKey === pkg.key}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg disabled:opacity-60 transition-colors"
            >
              {loadingKey === pkg.key ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </main>
  );
}
