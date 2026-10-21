'use client';
import { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';

const apiUrl = "https://pdf-extract-service-basic.onrender.com";
const FREE_MAX_MB = 10;

export default function FreeBasicPanel() {
  const [basicFile, setBasicFile] = useState<File | null>(null);
  const [basicLoading, setBasicLoading] = useState(false);
  const [basicResultText, setBasicResultText] = useState('');
  const [basicError, setBasicError] = useState('');
  const [basicWarnMsg, setBasicWarnMsg] = useState('');
  const [basicOverLimit, setBasicOverLimit] = useState(false);
  const [basicRejectReason, setBasicRejectReason] = useState('');

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

      const res = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
      });
      console.log('response status:', res.status);

      const data = await res.json().catch(() => ({ detail: 'Server error' }));
      if (!res.ok) {
        throw new Error(`Status ${res.status}, detail: ${data.detail ?? 'unknown'}`);
      }

      if (data.type === 'image-only') {
        setBasicRejectReason('⚠️ This PDF contains only scanned images. Free plan cannot convert image‑only PDFs, upgrade to Premium for OCR.');
        setBasicError('Document rejected');
        return;
      }
      if (data.type === 'mixed') {
        setBasicRejectReason('ℹ️ This document contains non‑text pages. Complex mixed‑layout documents are not supported on the free plan, upgrade to Premium.');
        setBasicError('Document rejected');
        return;
      }

      // 前端兜底过滤控制字符
      const cleanText = (data.text || '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1F]/g, '');
      setBasicResultText(cleanText);
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

  const handleDownloadDocx = async (text: string) => {
    if (!text) return;
    try {
      const paragraphs = text.split('\n').map((line) => {
        return new Paragraph({ children: [new TextRun(line)] });
      });
      const doc = new Document({ sections: [{ children: paragraphs }] });
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Free Basic Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-sm text-gray-600 space-y-1">
          <p>✅ Max file size: 10 MB</p>
          <p>✅ Plain text PDF extraction only</p>
          <p className="text-amber-600">⚠️ Text only, layout/alignment will not be preserved.</p>
          <p>❌ No scanned / image PDFs</p>
          <p>❌ No complex multi‑script mixed layout</p>
        </div>

        <FileUpload onFileSelect={handleBasicFileSelect} accept=".pdf" maxSizeMB={FREE_MAX_MB} />

        {basicFile && (
          <p className="text-sm text-gray-600">
            Selected: {basicFile.name} ({(basicFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}

        {basicError && <p className="text-red-600 text-sm">{basicError}</p>}
        {basicRejectReason && <p className="text-amber-600 text-sm">{basicRejectReason}</p>}
        {basicWarnMsg && <p className="text-green-600 text-sm">{basicWarnMsg}</p>}

        <div className="pt-2">
          {basicOverLimit || !!basicRejectReason ? (
            <p className="text-blue-600 font-medium text-sm">Upgrade to Premium to process this document.</p>
          ) : (
            <Button onClick={handleBasicConvert} disabled={basicLoading} className="w-full">
              {basicLoading ? 'Converting...' : 'Convert to Editable Text'}
            </Button>
          )}
        </div>

        {basicResultText && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Extracted Content:</h3>
            <textarea
              readOnly
              value={basicResultText}
              className="w-full h-64 border p-3 rounded-md resize-y text-sm"
            />
            <div className="mt-3">
              <Button variant="outline" onClick={() => handleDownloadDocx(basicResultText)} className="w-full">
                Download DOCX
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
