'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[a-zA-Z]/, 'Must contain at least one letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});
type FormData = z.infer<typeof schema>;

const HCaptcha = dynamic(() => import('@hcaptcha/react-hcaptcha'), {
  ssr: false,
  loading: () => <p className="text-sm text-gray-500 py-2">Loading captcha…</p>,
});

export default function RegisterForm() {
  const router = useRouter();
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState('');
  const captchaRef = useRef<any>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onCaptchaLoad = (instance: any) => {
    captchaRef.current = instance;
  };

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    setServerErr('');
    if (!hcaptchaToken) {
      setServerErr("hCaptcha verification required");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${base}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          hcaptchaToken: hcaptchaToken,
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerErr(result.detail || "Registration failed");
        captchaRef.current?.reset();
        setHcaptchaToken('');
      } else {
        router.push('/login?registered=true');
      }
    } catch (err) {
      console.error(err);
      setServerErr("Network error, please try again later.");
    } finally {
      setLoading(false);
      captchaRef.current?.reset();
      setHcaptchaToken('');
    }
  };

  return (
    <main className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-2">Create Account</h1>
      <p className="text-gray-600 mb-6">Join FiledocSwift</p>

      {serverErr && (
        <div role="alert" aria-live="assertive" className="bg-red-50 text-red-700 p-3 rounded mb-4">
          {serverErr}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            disabled={loading}
            className="w-full border p-2 rounded"
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <p className="text-xs text-gray-500 mb-1">Minimum 8 characters, must include letters and numbers</p>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            disabled={loading}
            className="w-full border p-2 rounded"
            aria-describedby={errors.password ? 'pw-error' : undefined}
          />
          {errors.password && <p id="pw-error" className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <HCaptcha
          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
          languageOverride="en"
          onLoad={onCaptchaLoad}
          onVerify={(token) => setHcaptchaToken(token)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Register'}
        </button>
      </form>
      <p className="mt-3 text-sm">
        Already have an account? <Link href="/login" className="text-blue-600 underline">Sign in</Link>
      </p>
    </main>
  );
}
