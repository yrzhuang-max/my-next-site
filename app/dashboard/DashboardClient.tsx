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

const FETCH_TIMEOUT_MS = 8000;

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  return (
    <main className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome</p>

      <div className="border p-4 rounded mb-6 space-y-2">
        <p><span className="font-medium">User ID:</span> {user?.id ?? 'N/A'}</p>
        <p><span className="font-medium">Email:</span> {user?.email ?? 'N/A'}</p>
        <p><span className="font-medium">Credit Balance:</span> {user?.credit_balance ?? 0}</p>
        <p><span className="font-medium">Subscription Plan:</span> {user?.subscription_plan ?? 'free'}</p>
        <p><span className="font-medium">Subscription Status:</span> {user?.subscription_status ?? 'inactive'}</p>
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
