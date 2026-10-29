// app/(auth)/reset-password/[token]/page.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export default function ResetConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [serverMsg, setServerMsg] = useState('');
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerMsg('');
    setServerErr('');
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${base}/api/auth/reset-password-confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || 'Reset failed');
      setServerMsg(json.msg);
      setTimeout(() => router.push('/login'), 2000);
    } catch (e: any) {
      setServerErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-2">Set a New Password</h1>
      <p className="text-gray-600 mb-6">Create your new account password</p>

      {serverMsg && (
        <div role="status" aria-live="polite" className="bg-green-50 text-green-700 p-3 rounded mb-4">
          {serverMsg}
        </div>
      )}
      {serverErr && (
        <div role="alert" aria-live="assertive" className="bg-red-50 text-red-700 p-3 rounded mb-4">
          {serverErr}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">New Password</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            disabled={loading}
            className="w-full border p-2 rounded"
            aria-describedby={errors.password ? 'pw-error' : undefined}
          />
          {errors.password && <p id="pw-error" className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            disabled={loading}
            className="w-full border p-2 rounded"
            aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
          />
          {errors.confirmPassword && <p id="confirm-error" className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Updating…' : 'Update Password'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Link expires in 1 hour and can only be used once.
      </p>
      <p className="mt-2 text-sm">
        <a href="/reset-password" className="text-blue-600 underline">Request a new reset link</a>
      </p>
    </main>
  );
}
