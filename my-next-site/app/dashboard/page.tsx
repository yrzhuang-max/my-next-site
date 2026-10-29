'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${base}/api/auth/me`, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setUser(data.user);
      } catch (_) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router, base]);

  const handleLogout = async () => {
    await fetch(`${base}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    router.push('/login');
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return null;

  return (
    <main className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-2">Email: {user.email}</p>
      <p className="mb-6">User ID: {user.id}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </main>
  );
}
