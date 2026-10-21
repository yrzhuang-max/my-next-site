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

  const handleFileSelect = (selectedFile: File | null) => {
    setError('');
    setResultText('');
    setFile(selectedFile);
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = process.env.PDF_EXTRACT_API;
      const res = await fetch(`${apiUrl}/extract-text`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Conversion failed, please try again.');
      }
      const json = await res.json();
      setResultText(json.text || '');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-2">PDF to Word Converter</h1>
      <p className="text-gray-600 text-center mb-8">Extract text from PDF and export editable content</p>

      <Card>
        <CardHeader>
          <CardTitle>Upload your PDF (Max 20MB)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            accept=".pdf"
            maxSizeMB={20}
          />
          {file && <p className="text-sm text-gray-700">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button onClick={handleConvert} disabled={loading}>
            {loading ? 'Converting...' : 'Convert to Editable Text'}
          </Button>

          {resultText && (
            <div>
              <h3 className="font-semibold mb-2">Extracted Content:</h3>
              <textarea
                readOnly
                value={resultText}
                className="w-full h-72 border p-3 rounded-md resize-y"
              />
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
