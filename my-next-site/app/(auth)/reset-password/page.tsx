'use client';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const schema = z.object({
  email: z.string().email('Valid email required'),
});
type FormData = z.infer<typeof schema>;

export default function ResetRequestPage() {
  const [serverMsg, setServerMsg] = useState('');
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState('');
  const captchaRef = useRef<HCaptcha>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerMsg('');
    setServerErr('');
    setLoading(true);
    if (!hcaptchaToken) {
      setServerErr('Please complete hCaptcha');
      setLoading(false);
      return;
    }
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${base}/api/auth/reset-password-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          hcaptchaToken: hcaptchaToken,
        }),
      });

        // 👉 限流判断在这里
  if (res.status === 429) {
    setServerErr("Too many attempts, please try again later.");
    return;
  }
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || 'Failed to send link');
      setServerMsg(json.msg);
    } catch (e: any) {
      setServerErr(e.message);
    } finally {
      captchaRef.current?.resetCaptcha();
      setHcaptchaToken('');
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
      <p className="text-gray-600 mb-6">Enter your email to receive a reset link</p>

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
            {...register('email')}
            disabled={loading}
            className="w-full border p-2 rounded"
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <HCaptcha
          ref={captchaRef}
          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
          onVerify={(token) => setHcaptchaToken(token)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Remember your password? <a href="/login" className="text-blue-600 underline">Sign in</a>
      </p>
    </main>
  );
}