'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${base}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
        const data = await res.json();
        setUser(data);
      } catch {
        setErr('未登录或登录已过期，正在跳转登录页');
        setTimeout(() => router.push('/login'), 1200);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [base, router]);

  const handleLogout = async () => {
    try {
      await fetch(`${base}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
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

      <div className="border p-4 rounded mb-6">
        <p className="mb-1"><span className="font-medium">User ID：</span>{user?.id}</p>
        <p><span className="font-medium">Email：</span>{user?.email}</p>
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