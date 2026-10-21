'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';
import FAQAccordion from '@/components/FAQAccordion';

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
    answer: "Uploaded files are processed temporarily and not stored on our server."
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
  // Basic
  const [basicFile, setBasicFile] = useState<File | null>(null);
  const [basicLoading, setBasicLoading] = useState(false);
  const [basicErr, setBasicErr] = useState<string | null>(null);

  const handleBasicConvert = async () => {
    if (!basicFile) return;
    setBasicLoading(true);
    setBasicErr(null);
    try {
      const fd = new FormData();
      fd.append('file', basicFile);
      const res = await fetch('/api/pdf-to-word', {
        method: 'POST',
        body: fd
      });
      if (!res.ok) {
        const json = await res.json();
        setBasicErr(json.error || 'Convert failed');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${basicFile.name.replace(/\.pdf$/i, '')}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setBasicErr('Request error');
    } finally {
      setBasicLoading(false);
    }
  };

  const resetBasic = () => {
    setBasicFile(null);
    setBasicErr(null);
  };

  return (
    <main className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">PDF to Word Converter</h1>
          <p className="text-gray-500 mt-2">Choose the version that fits your document needs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Basic */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Basic
                <span className="text-sm font-normal bg-green-100 text-green-700 px-2 py-0.5 rounded">Free</span>
              </CardTitle>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>✅ Plain text PDF to DOCX</p>
                <p>✅ Basic paragraph layout</p>
                <p className="text-red-500">❌ No images, scanned PDFs or complex tables</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <FileUpload onFileSelect={setBasicFile} maxSizeMB={25} />
                {basicErr && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{basicErr}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleBasicConvert} disabled={!basicFile || basicLoading}>
                    {basicLoading ? 'Processing...' : 'Convert to Word'}
                  </Button>
                  {(basicFile || basicErr) && (
                    <Button variant="outline" onClick={resetBasic}>
                      New Conversion
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium（占位，后面你再加Premium接口） */}
          <Card className="border-blue-400 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Premium
                <span className="text-sm font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Paid</span>
              </CardTitle>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>✅ All Basic features</p>
                <p>✅ Embedded images & complex tables</p>
                <p>✅ OCR for scanned image PDFs</p>
                <p>✅ Advanced layout reconstruction</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <FileUpload onFileSelect={() => {}} maxSizeMB={25} />
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Coming Soon</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <AdUnit /> */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <FAQAccordion items={faqList} />
        </div>
      </div>
    </main>
  );
}
