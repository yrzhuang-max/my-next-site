// app/dashboard/recharge/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  email: string;
  credit_balance: number;
  subscription_plan: string;
  subscription_status: string;
  subscription_expires_at: string | null;
};

type PricePlan = {
  price_id: string;
  name: string;
  credit_amount: number;
  plan_type: 'points' | 'monthly' | 'yearly';
};

const FETCH_TIMEOUT_MS = 8000;

export default function RechargePage() {
  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [user, setUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<PricePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<string | null>(null);

  // Fetch current user for subscription guard
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUser = async () => {
      if (!base) {
        setErr('API base url is not configured.');
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        const res = await fetch(`${base}/api/auth/me`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          signal,
        });
        clearTimeout(timeout);

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
            return;
          }
          setErr(`Failed to load user, status: ${res.status}`);
          return;
        }
        const data = await res.json();
        if (!data || !data.user) {
          setErr('Invalid user data from server.');
          return;
        }
        setUser(data.user);
      } catch (e: unknown) {
        if ((e as Error)?.name !== 'AbortError') {
          console.error('Failed to fetch user', e);
          setErr('Network error while loading user profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    return () => controller.abort();
  }, [base, router]);

  // Fetch available paddle price plans
  useEffect(() => {
    if (!user || !base) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const controller = new AbortController();
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${base}/api/paddle/plans`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        if (res.ok) {
          const list = await res.json();
          setPlans(list);
        }
      } catch (e: unknown) {
        if ((e as Error)?.name !== 'AbortError') {
          console.error('Failed to load price plans', e);
        }
      }
    };
    fetchPlans();
    return () => controller.abort();
  }, [user, base]);

  const startCheckout = async (priceId: string) => {
    if (!base) return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setCheckoutLoadingId(priceId);
    try {
      const res = await fetch(`${base}/api/paddle/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price_id: priceId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.detail || 'Failed to create checkout session');
        return;
      }
      window.location.href = json.checkout_url;
    } catch (err) {
      alert('Network error when creating checkout, please try again.');
      console.error(err);
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p>Loading plans...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{err}</div>
      </div>
    );
  }

  const hasActiveSubscription =
  !!user?.subscription_expires_at && new Date(user.subscription_expires_at) > new Date();

  const pointPlans = plans.filter((p) => p.plan_type === 'points');
  const subPlans = plans.filter((p) => p.plan_type === 'monthly' || p.plan_type === 'yearly');

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-center mb-3">OCR Credit Plans</h1>
      <p className="text-center text-gray-500 mb-12">
        Buy one‑time credits or subscribe for recurring quota
      </p>

      {hasActiveSubscription && (
        <div className="max-w-2xl mx-auto mb-10 p-4 border border-amber-200 bg-amber-50 rounded-lg text-amber-700 text-center">
          You have an active subscription. You may only purchase one-time point packs.
        </div>
      )}

      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">One‑time Credits</h2>
        {pointPlans.length === 0 ? (
          <p className="text-gray-500">No point packs available.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {pointPlans.map((plan) => (
              <div key={plan.price_id} className="border rounded-xl p-6 md:col-start-2">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-2xl font-bold mt-2">{plan.credit_amount} Credits</p>
                <p className="text-gray-500 text-sm mt-2">Permanent one-time OCR credits, no expiry</p>
                <button
                  onClick={() => startCheckout(plan.price_id)}
                  disabled={checkoutLoadingId === plan.price_id}
                  className="mt-6 w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 disabled:opacity-60"
                >
                  {checkoutLoadingId === plan.price_id ? 'Processing…' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">Recurring Subscriptions</h2>
        {subPlans.length === 0 ? (
          <p className="text-gray-500">No subscription plans available.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {subPlans.map((plan) => {
              const disabled = hasActiveSubscription;
              return (
                <div
                  key={plan.price_id}
                  className={`border rounded-xl p-6 ${disabled ? 'bg-gray-50' : ''}`}
                >
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-2">{plan.credit_amount} Credits / Cycle</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {plan.plan_type === 'monthly' ? 'Monthly recurring quota' : 'Yearly recurring quota'}
                  </p>
                  <button
                    onClick={() => startCheckout(plan.price_id)}
                    disabled={disabled || checkoutLoadingId === plan.price_id}
                    className="mt-6 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {checkoutLoadingId === plan.price_id
                      ? 'Processing…'
                      : disabled
                      ? 'Unavailable'
                      : 'Subscribe'}
                  </button>
                  {disabled && (
                    <p className="text-xs mt-2 text-amber-600">
                      Cannot purchase while another subscription is active
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <p className="text-center text-gray-400 text-sm mt-12">
        All purchases are processed securely by Paddle. You will be redirected to their checkout page.
        One-time credits never expire. Subscription credits refresh each billing cycle while active.
      </p>
    </div>
  );
}
