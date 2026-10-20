'use client';
import { useState } from 'react';
import Button from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
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
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (data.success) {
        setTip({ text: '消息发送成功！我们会尽快回复您。', ok: true });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setTip({ text: data.message || '发送失败，请重试', ok: false });
      }
    } catch () {
      setTip({ text: '网络错误，请稍后再试', ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <p className="text-gray-500 mt-2">Send us your questions or feedback.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {tip && (
                <p className={`text-sm font-medium ${tip.ok ? 'text-green-600' : 'text-red-600'}`}>
                  {tip.text}
                </p>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}