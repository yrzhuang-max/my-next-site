'use client';
import { useState } from 'react';
import Button from '@/components/Button';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // honeypot字段
  const [website, setWebsite] = useState('');

  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState<{ text: string; ok: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTip(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      });
      const result = await res.json();
      if (result.spam) {
        setTip({ text: '提交被拦截，请稍后重试', ok: false });
      } else if (result.success) {
        setTip({ text: '消息发送成功！', ok: true });
        setName('');
        setEmail('');
        setMessage('');
        setWebsite('');
      } else {
        setTip({ text: '发送失败，请重试', ok: false });
      }
    } catch (_err) {
      setTip({ text: '网络错误，请稍后再试', ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-12 md:py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* ===== HoneyPot 蜜罐（隐藏，不要删除 ===== */}
          <div className="hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
        {tip && (
          <p className={`mt-4 ${tip.ok ? 'text-green-600' : 'text-red-600'}`}>
            {tip.text}
          </p>
        )}
      </div>
    </main>
  );
}