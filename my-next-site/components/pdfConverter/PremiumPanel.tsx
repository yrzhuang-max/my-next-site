'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function PremiumPanel() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleNotifySubmit = async () => {
    setEmailError('');
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      // 后续对接 waitlist 接口
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setEmailError('Failed to subscribe, please try again later.');
      }
    } catch (_err) {
      setEmailError('Network error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-400">
      <CardHeader>
        <CardTitle className="text-lg">Premium Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-sm text-gray-600 space-y-1">
          <p>✅ Large file uploads (up to 50MB)</p>
          <p>✅ OCR for scanned / image PDFs</p>
          <p>✅ Complex multi‑script mixed layout support</p>
          <p>✅ Preserve original layout & alignment</p>
          <p>✅ Batch conversion & faster processing</p>
        </div>

        <div className="bg-sky-50 border border-sky-200 p-4 rounded-md">
          <p className="text-sky-700 font-medium">🚧 Premium feature under construction</p>
          <p className="text-sky-600 text-xs mt-1">
            OCR, layout restoration and batch conversion are in development. We will notify you once launched.
          </p>
        </div>

        {submitted ? (
          <p className="text-green-600 text-sm">
            ✅ Registered successfully. Launch notification will be sent to your email.
          </p>
        ) : (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Leave your email for launch notification"
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
            <Button onClick={handleNotifySubmit} disabled={loading} className="w-full">
              {loading ? 'Subscribing...' : 'Subscribe for Launch Notice'}
            </Button>
          </div>
        )}

        <Button disabled className="w-full opacity-60">
          Convert to Editable Text
        </Button>
      </CardContent>
    </Card>
  );
}