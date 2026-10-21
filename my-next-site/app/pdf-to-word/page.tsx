'use client';
import { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
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
  // ========== 免费基础版 state ==========
  const [basicFile, setBasicFile] = useState<File | null>(null);
  const [basicLoading, setBasicLoading] = useState(false);
  const [basicResultText, setBasicResultText] = useState('');
  const [basicError, setBasicError] = useState('');
  const [basicWarnMsg, setBasicWarnMsg] = useState('');
  const [basicOverLimit, setBasicOverLimit] = useState(false);
  const [basicRejectReason, setBasicRejectReason] = useState('');

  // ========== 高级版 state ==========
  const [premiumFile, setPremiumFile] = useState<File | null>(null);

  const FREE_MAX_MB = 10;
  const apiUrl = "https://pdf-extract-service-basic.onrender.com";

  // 基础版 文件选择
  const handleBasicFileSelect = (selectedFile: File | null) => {
    setBasicError('');
    setBasicWarnMsg('');
    setBasicResultText('');
    setBasicOverLimit(false);
    setBasicRejectReason('');
    setBasicFile(selectedFile);

    if (!selectedFile) return;
    const fileMb = selectedFile.size / 1024 / 1024;
    if (fileMb > FREE_MAX_MB) {
      setBasicOverLimit(true);
      setBasicError(`File is ${fileMb.toFixed(2)} MB, exceeding free ${FREE_MAX_MB}MB limit.`);
    }
  };

  // 基础版 转换
  const handleBasicConvert = async () => {
    if (!basicFile) {
      setBasicError('Please select a PDF file first.');
      return;
    }
    if (basicOverLimit) return;

    setBasicLoading(true);
    setBasicError('');
    setBasicWarnMsg('');
    setBasicRejectReason('');
    try {
      const formData = new FormData();
      formData.append('file', basicFile);
      const targetUrl = `${apiUrl}/extract-text`;
      console.log('request url:', targetUrl);
      console.log('file name:', basicFile.name, 'size:', basicFile.size);

      const res = await fetch(targetUrl, {
        method: 'POST',
        body: formData
      });
      console.log('response status:', res.status);

      const data = await res.json().catch(() => ({ detail: 'no message' }));

      if (!res.ok) {
        throw new Error(`Status ${res.status}, detail: ${data.detail ?? 'no message'}`);
      }

      if (data.type === 'image-only') {
        setBasicRejectReason('⚠️ This PDF contains only scanned images. Free plan cannot convert image-only PDFs, upgrade to Premium for OCR.');
        setBasicError('Document rejected');
        return;
      }
      if (data.type === 'mixed') {
        setBasicRejectReason('ℹ️ Text extraction supports most languages, but correct rendering depends on the original PDF font and encoding. Complex mixed-layout documents such as contracts mixing English, Chinese and Arabic are not supported on the free plan. Right-to-left scripts may have order/layout issues.');
        setBasicError('Document rejected');
        return;
      }

      setBasicResultText(data.text || '');
      setBasicWarnMsg('✅ Text extracted successfully.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setBasicError(err.message);
      } else {
        setBasicError('Conversion failed, please try again.');
      }
    } finally {
      setBasicLoading(false);
    }
  };

  // DOCX 下载
  const handleDownloadDocx = async (text: string) => {
    if (!text) return;
    try {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text,
                  }),
                ],
              }),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extracted.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setBasicError('Failed to generate DOCX file');
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-2">PDF to Word Converter</h1>
      <p className="text-gray-600 text-center mb-10">Extract text from PDF and export editable content</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ========== 免费基础版 ========== */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Free Basic Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="text-sm text-gray-600 space-y-1">
              <p>✅ Max file size: 10 MB</p>
              <p>✅ Plain text PDF extraction only</p>
              <p>❌ No scanned / image PDFs</p>
              <p>❌ No complex multi-script mixed layout</p>
            </div>

            <FileUpload
              onFileSelect={handleBasicFileSelect}
              accept=".pdf"
              maxSizeMB={FREE_MAX_MB}
            />

            {basicFile && (
              <p className="text-sm text-gray-600">
                Selected: {basicFile.name} ({(basicFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}

            {basicError && <p className="text-red-600 text-sm">{basicError}</p>}
            {basicRejectReason && <p className="text-amber-600 text-sm">{basicRejectReason}</p>}
            {basicWarnMsg && <p className="text-green-600 text-sm">{basicWarnMsg}</p>}

            {basicOverLimit || !!basicRejectReason ? (
              <p className="text-blue-600 font-medium text-sm">
                Upgrade to Premium to process this document.
              </p>
            ) : (
              <Button onClick={handleBasicConvert} disabled={basicLoading}>
                {basicLoading ? 'Converting...' : 'Convert to Editable Text'}
              </Button>
            )}

            {basicResultText && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Extracted Content:</h3>
                <textarea
                  readOnly
                  value={basicResultText}
                  className="w-full h-64 border p-3 rounded-md resize-y text-sm"
                />
                <div className="mt-3">
                  <Button variant="outline" onClick={() => handleDownloadDocx(basicResultText)}>
                    Download DOCX
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ========== Premium高级版（仅展示，不处理） ========== */}
        <Card className="border-blue-400">
          <CardHeader>
            <CardTitle className="text-lg">Premium Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="text-sm text-gray--600 space-y-1">
              <p>✅ Large file uploads</p>
              <p>✅ OCR for scanned / image PDFs</p>
              <p>✅ Complex multi-script mixed layout support</p>
              <p>✅ Batch conversion & faster processing</p>
            </div>

            <FileUpload
              onFileSelect={setPremiumFile}
              accept=".pdf"
              maxSizeMB={50}
            />

            {premiumFile && (
              <p className="text-sm text-gray-600">
                Selected: {premiumFile.name} ({(premiumFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}

            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-blue-700 text-sm font-medium">
                Premium feature, unlock after subscription.
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Supports scanned PDFs, multi-language对照 documents and batch jobs.
              </p>
            </div>

            <Button disabled>Convert to Editable Text</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">FAQs</h2>
        <FAQAccordion items={faqList} />
      </div>
    </main>
  );
}
