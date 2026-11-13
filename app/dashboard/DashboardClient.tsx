'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  email: string;
  credit_balance: number;
  subscription_plan: string;
  subscription_status: string;
  background: string;
  foreground: string;
};

type PricePlan = {
  price_id: string;
  name: string;
  credit_amount: number;
  plan_type: 'points' | 'monthly' | 'yearly';
};

const FETCH_TIMEOUT_MS = 8000;

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [paymentNotice, setPaymentNotice] = useState<{ type: 'success' | 'cancel'; msg: string } | null>(null);
  const [plans, setPlans] = useState<PricePlan[]>([]);
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<string | null>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Parse payment callback search params and clear url
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paid = params.get('paid');
    if (paid === 'success') {
      setPaymentNotice({ type: 'success', msg: 'Payment successful! Your OCR credits have been added.' });
      params.delete('paid');
      router.replace('/dashboard');
    } else if (paid === 'cancel') {
      setPaymentNotice({ type: 'cancel', msg: 'Payment cancelled. No credits were charged.' });
      params.delete('paid');
      router.replace('/dashboard');
    }
  }, [router]);

  // Fetch user profile and auth guard
  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
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
        setErr('Not logged in or session expired, redirecting to login...');
        redirectTimer = setTimeout(() => router.push('/login'), 1200);
        setLoading(false);
        return;
      }

      try {
        const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        const res = await fetch(`${base}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal
        });
        clearTimeout(timeout);

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            setErr('Not logged in or session expired, redirecting to login...');
            redirectTimer = setTimeout(() => router.push('/login'), 1200);
          } else {
            setErr(`Request failed, status: ${res.status}`);
          }
          return;
        }

        const data = await res.json();
        if (!data || !data.user) {
          setErr('Invalid user data from server.');
          return;
        }
        setUser(data.user);
      } catch (e: unknown) {
        if ((e as Error)?.name === 'AbortError') return;
        console.error('Failed to fetch user', e);
        setErr('Network error, failed to load user info.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      controller.abort();
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [base, router]);

  // Load available price plans after user is ready
  useEffect(() => {
    if (!user || !base) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const controller = new AbortController();
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${base}/api/paddle/plans`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
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

  // Create paddle checkout session
  const startCheckout = async (priceId: string) => {
    if (!base) return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setCheckoutLoadingId(priceId);
    try {
      const res = await fetch(`${base}/api/paddle/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ price_id: priceId })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.detail || 'Failed to create checkout');
        return;
      }
      window.open(json.checkout_url, '_blank');
    } catch (e) {
      console.error('Checkout creation failed', e);
      alert('Network error when creating checkout');
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      await fetch(`${base}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeout);
    } catch (e: unknown) {
      if ((e as Error)?.name !== 'AbortError') {
        console.error('Logout error', e);
      }
    } finally {
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <main className="max-w-md mx-auto mt-16 px-4">
        <p>Loading...</p>
      </main>
    );
  }

  if (err) {
    return (
      <main className="max-w-md mx-auto mt-16 px-4">
        <div className="bg-red-50 text-red-700 p-3 rounded">
          {err}
        </div>
      </main>
    );
  }

  const hasActiveSubscription =
    user?.subscription_plan && user.subscription_plan !== 'free' && user.subscription_status === 'active';

  return (
    <main className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome</p>

      {paymentNotice && (
        <div className={`p-4 rounded-lg mb-6 ${
          paymentNotice.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
          {paymentNotice.msg}
        </div>
      )}

      <div className="border p-4 rounded mb-6 space-y-2">
        <p><span className="font-medium">User ID:</span> {user?.id ?? 'N/A'}</p>
        <p><span className="font-medium">Email:</span> {user?.email ?? 'N/A'}</p>
        <p><span className="font-medium">Credit Balance:</span> {user?.credit_balance ?? 0}</p>
        <p><span className="font-medium">Subscription Plan:</span> {user?.subscription_plan ?? 'free'}</p>
        <p><span className="font-medium">Subscription Status:</span> {user?.subscription_status ?? 'inactive'}</p>

        <div className="pt-3 mt-3 border-t border-gray-200">
          <p className="font-medium mb-3">Available Packages</p>
          {hasActiveSubscription && (
            <p className="text-amber-600 text-sm mb-3">
              You already have an active subscription. You may only purchase point packs.
            </p>
          )}
          <div className="space-y-3">
            {plans.map(plan => {
              const isSub = plan.plan_type === 'monthly' || plan.plan_type === 'yearly';
              const disabled = isSub && hasActiveSubscription;
              return (
                <button
                  key={plan.price_id}
                  disabled={disabled || checkoutLoadingId === plan.price_id}
                  onClick={() => startCheckout(plan.price_id)}
                  className={`block w-full text-left border p-3 rounded transition-colors ${
                    disabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-sm text-gray-500">
                    {plan.credit_amount} OCR credits
                  </div>
                  {disabled && (
                    <div className="text-xs mt-1 text-amber-600">
                      Cannot purchase while another subscription is active
                    </div>
                  )}
                  {checkoutLoadingId === plan.price_id && (
                    <div className="text-xs mt-1 text-blue-600">Creating checkout…</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Keep original recharge link if you still want separate recharge page */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <a
              href="/dashboard/recharge"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition-colors"
            >
              Buy OCR Credits (Separate Page)
            </a>
            <p className="text-gray-500 text-sm mt-2">
              Credits for OCR scanned PDF conversion, permanent and never expire.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white py-2 rounded"
      >
        Logout
      </button>
    </main>
  );
}
