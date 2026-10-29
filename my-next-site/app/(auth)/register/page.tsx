'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverMsg, setServerMsg] = useState('');
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    const token = captchaRef.current?.getResponse();
    if (!token) {
      setServerErr("hCaptcha token为空！");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${base}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          hcaptchaToken: token,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerErr(result.msg);
        setServerMsg("");
      } else {
        setServerMsg(result.msg);
        setServerErr("");
        router.push("/login");
      }
    } catch (err) {
      setServerErr("请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-2">Create Account</h1>
      <p className="text-gray-600 mb-6">Sign up for FiledocSwift</p>

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
          ref={captchaRef}
          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
          languageOverride="en"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Submitting…' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <a href="/login" className="text-blue-600 underline">Sign in</a>
      </p>
    </main>
  );
}
