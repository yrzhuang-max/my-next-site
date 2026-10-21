'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import FAQAccordion from '@/components/FAQAccordion';

// 懒加载，关闭SSR
const PdfConverter = dynamic(() => import('@/components/PdfConverter'), {
  ssr: false,
  loading: () => <div className="p-10 text-center">Loading converter...</div>
});

// 广告组件
function AdUnit() {
  const [canShowAd, setCanShowAd] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') setCanShowAd(true);
  }, []);
  if (!canShowAd) return null;
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-YOUR_PUB_ID"
      data-ad-slot="YOUR_AD_SLOT_ID"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}

const faqList = [
  {
    question: "Is PDF to Word conversion free?",
    answer: "Yes, our Basic version is free for text-only PDFs. Premium features require a paid subscription."
  },
  {
    question: "Will my original formatting be preserved?",
    answer: "Basic version keeps plain text layout. Premium version supports images, tables and complex layout retention."
  },
  {
    question: "Are my uploaded files secure?",
    answer: "All uploaded files are automatically deleted after conversion. We do not store or share your documents with third parties."
  },
  {
    question: "What file size limits apply?",
    answer: "Both Basic and Premium support PDF files up to 25MB."
  },
  {
    question: "Can I convert scanned PDF files?",
    answer: "Scanned image PDFs require OCR, which is only available in our Premium plan."
  }
];

export default function PdfToWordPage() {
  return (
    <main className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">PDF to Word Converter</h1>
          <p className="text-gray-500 mt-2">Choose the version that fits your document needs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <PdfConverter
            title="Basic"
            badgeText="Free"
            badgeColor="bg-green-100 text-green-700"
            supportNotes={[
              "✅ Plain text PDF to DOCX",
              "✅ Basic paragraph layout",
              "❌ No images, scanned PDFs or complex tables"
            ]}
          />
          <PdfConverter
            title="Premium"
            badgeText="Paid"
            badgeColor="bg-blue-100 text-blue-700"
            supportNotes={[
              "✅ All Basic features",
              "✅ Embedded images & complex tables",
              "✅ OCR for scanned image PDFs",
              "✅ Advanced layout reconstruction"
            ]}
          />
        </div>

        {/* <AdUnit /> */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <FAQAccordion items={faqList}/>
        </div>
      </div>
    </main>
  );
}
