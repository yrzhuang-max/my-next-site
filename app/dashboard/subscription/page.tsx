// app/dashboard/subscription/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type SubStatus = 'active' | 'cancelled' | 'expired' | 'payment_failed' | null;

interface SubInfo {
  hasSubscription: boolean;
  packageKey: string | null;
  creditsPerMonth: number;
  status: SubStatus;
  renewAt: string | null;
  canCancel: boolean;
}

export default function SubscriptionManagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<SubInfo | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [tip, setTip] = useState('');

  useEffect(() => {
    const fetchSub = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch(
          'https://filedocswift-auth.onrender.com/api/recharge/my-subscription',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setSub(data);
        } else {
          setTip(data.detail ?? 'Failed to load subscription');
        }
      } catch {
        setTip('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchSub();
  }, [router]);

  const handleCancel = async () => {
    if (!sub?.hasSubscription) return;
    setActionLoading(true);
    setTip('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        'https://filedocswift-auth.onrender.com/api/recharge/cancel-subscription',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token ?? ''}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setTip('Your subscription has been scheduled for cancellation. It remains active until the end of the billing period.');
      } else {
        setTip(data.detail ?? 'Cancel failed');
      }
    } catch {
      setTip('Network error when cancelling');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p>Loading subscription info…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-2">My Subscription</h1>
      <p className="text-gray-500 mb-10">View and manage your monthly OCR plan</p>

      {tip && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 text-amber-800 text-sm">
          {tip}
        </div>
      )}

      {sub && sub.hasSubscription ? (
        <div className="border rounded-xl p-6 space-y-4">
          <div>
            <span className="text-gray-500 text-sm">Plan</span>
            <p className="text-xl font-semibold">100 Credits / Month</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Status</span>
            <p
              className={`font-medium ${
                sub.status === 'active'
                  ? 'text-emerald-600'
                  : sub.status === 'cancelled'
                  ? 'text-orange-600'
                  : 'text-red-600'
              }`}
            >
              {sub.status === 'active'
                ? 'Active'
                : sub.status === 'cancelled'
                ? 'Cancelling (valid until billing end)'
                : sub.status === 'payment_failed'
                ? 'Payment Failed'
                : 'Expired'}
            </p>
          </div>
          {sub.renewAt && (
            <div>
              <span className="text-gray-500 text-sm">Next billing</span>
              <p>{sub.renewAt}</p>
            </div>
          )}

          {sub.canCancel && sub.status === 'active' && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="mt-4 px-5 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {actionLoading ? 'Cancelling…' : 'Cancel Subscription'}
            </button>
          )}
        </div>
      ) : (
        <div className="border rounded-xl p-6 text-center">
          <p className="text-gray-500 mb-4">You do not have an active subscription.</p>
          <button
            onClick={() => router.push('/dashboard/recharge')}
            className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700"
          >
            View Plans
          </button>
        </div>
      )}
    </div>
  );
}
