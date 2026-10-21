'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';
import FAQAccordion from '@/components/FAQAccordion';

const faqList = [
  {
    question: "Is PDF to Word conversion free?",
    answer: "Yes, you can convert PDF to Word for free with basic limits. Large files may require longer processing time."
  },
  {
    question: "Will my original formatting be preserved?",
    answer: "Our tool attempts to retain text, tables and basic layout. Complex graphics or scanned image-only PDFs may have formatting changes after conversion."
  },
  {
    question: "Are my uploaded files secure?",
    answer: "Files are processed temporarily and deleted after conversion. We do not store your PDFs permanently."
  }
];

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [error, setError] = useState('');
  const [warnMsg, setWarnMsg] = useState('');
  const [isOverFreeLimit, setIsOverFreeLimit] = useState(false);

  const FREE_MAX_MB = 10;

  const handleFileSelect = (selectedFile: File | null) => {
    setError('');
    setWarnMsg('');
    setResultText('');
    setIsOverFreeLimit(false);
    setFile(selectedFile);

    if (!selectedFile) return;
    const fileMb = selectedFile.size / 1024 / 1024;
    if (fileMb > FREE_MAX_MB) {
      setIsOverFreeLimit(true);
      setError(`File is ${fileMb.toFixed(2)} MB, exceeding free ${FREE_MAX_MB}MB limit.`);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    if (isOverFreeLimit) return;

    setLoading(true);
    setError('');
    setWarnMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const apiUrl = "https://pdf-extract-service-basic.onrender.com";
      const targetUrl = `${apiUrl}/extract-text`;
      console.log('request url:', targetUrl);
      console.log('file name:', file.name, 'size:', file.size);

      const res = await fetch(targetUrl, {
        method: 'POST',
        body: formData
      });
      console.log('response status:', res.status);

      let errInfo: { detail?: string } = {};
      try {
        errInfo = await res.json();
      } catch {}

      if (!res.ok) {
        throw new Error(`Status ${res.status}, detail: ${errInfo.detail ?? 'no message'}`);
      }
      const json = await res.json();
      setResultText(json.text || '');

      if (json.type === 'image-only') {
        setWarnMsg('⚠️ This PDF contains only scanned images. Free plan cannot convert image-only PDFs, upgrade to Premium for OCR.');
      } else if (json.type === 'mixed') {
        setWarnMsg('⚠️ This PDF contains image areas. Image parts cannot be recognized, only existing text is extracted.');
      } else {
        setWarnMsg('ℹ️ Text extraction supports most languages, but correct rendering depends on the original PDF font and encoding. Complex mixed-layout documents such as contracts mixing English, Chinese and Arabic are not supported on the free plan. Right-to-left scripts may have order/layout issues.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Conversion failed, please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-2">PDF to Word Converter</h1>
      <p className="text-gray-600 text-center mb-8">Extract text from PDF and export editable content</p>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Free Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>✅ Max file size: 10 MB</p>
            <p>✅ Basic text extraction</p>
            <p>✅ Standard processing speed</p>
            <p>❌ No batch conversion</p>
            <p>❌ No OCR for scanned PDFs</p>
            <p>❌ Complex multi-script mixed layout (Arabic + English + Chinese etc.)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Premium Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>✅ Large file uploads</p>
            <p>✅ Batch conversion</p>
            <p>✅ OCR for scanned / image PDFs</p>
            <p>✅ Faster priority processing</p>
            <p>✅ Advanced layout recovery & multi-script mixed documents</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload your PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            accept=".pdf"
            maxSizeMB={FREE_MAX_MB}
          />
          {file && (
            <p className="text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {warnMsg && <p className="text-amber-600 text-sm">{warnMsg}</p>}

          {isOverFreeLimit ? (
            <p className="text-blue-600 font-medium">
              Upgrade to Premium to process this large document.
            </p>
          ) : (
            <Button onClick={handleConvert} disabled={loading}>
              {loading ? 'Converting...' : 'Convert to Editable Text'}
            </Button>
          )}

          {resultText && (
            <div>
              <h3 className="font-semibold mb-2">Extracted Content:</h3>
              <textarea
                readOnly
                value={resultText}
                className="w-full h-72 border p-3 rounded-md resize-y"
              />
              <div className="mt-3">
                <Button variant="outline">Download DOCX</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">FAQs</h2>
        <FAQAccordion items={faqList} />
      </div>
    </main>
  );
}
