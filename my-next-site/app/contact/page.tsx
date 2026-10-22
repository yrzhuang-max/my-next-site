'use client';
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'PDF to Word Converter',
  description: 'Convert PDF to editable DOCX Word document online for free. Preserve text and table layout, no signup required.',
  alternates: {
    canonical: '/pdf-to-word',
  },
}
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
      if (result.success) {
        setTip({ text: 'Thank you! Your message has been sent successfully.', ok: true });
        setName('');
        setEmail('');
        setMessage('');
        setWebsite('');
      } else {
        setTip({ text: result.message || 'Failed to send, please try again later.', ok: false });
      }
    } catch (_err) {
      setTip({ text: 'Network error, please try again later.', ok: false });
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
          {/* ===== HoneyPot 蜜罐，移出屏幕外（推荐方案） ===== */}
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute -left-[9999px] w-0 h-0 opacity-0 pointer-events-none"
          />
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
