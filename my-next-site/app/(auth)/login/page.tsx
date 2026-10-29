'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState('');
  const captchaRef = useRef<HCaptcha>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    setServerErr('');
    if (!hcaptchaToken) {
      setServerErr("hCaptcha验证未完成");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          hcaptchaToken: hcaptchaToken,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerErr(result.msg);
      } else {
        // 登录成功跳转到仪表盘
        router.push("/dashboard");
      }
    } catch (err) {
      setServerErr("网络请求异常，请稍后重试");
    } finally {
      setLoading(false);
      captchaRef.current?.resetCaptcha();
      setHcaptchaToken('');
    }
  };

  return (
    <main className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-2">Sign In</h1>
      <p className="text-gray-600 mb-6">Welcome back to FiledocSwift</p>

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
            autoComplete="current-password"
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
          onVerify={(token) => setHcaptchaToken(token)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      {/* 新增忘记密码链接 */}
      <p className="mt-3 text-sm">
        <a href="/reset-password" className="text-blue-600 underline">Forgot password?</a>
      </p>
      <p className="mt-2 text-sm">
        Don't have an account? <a href="/register" className="text-blue-600 underline">Create one</a>
      </p>
    </main>
  );
}