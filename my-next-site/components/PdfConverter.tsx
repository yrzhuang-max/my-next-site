'use client';
import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';

type Props = {
  title: string;
  badgeText: string;
  badgeColor: string;
  supportNotes: string[];
  onConvert?: () => Promise<void>;
};

export default function PdfConverter({ title, badgeText, badgeColor, supportNotes }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runConvert = useCallback(async () => {
    if (!file) return;
    setConverting(true);
    setProgress(0);
    setDownloadUrl(null);
    setError(null);
    try {
      // 全部库导入放在这里，且这个组件ssr=false
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs';
      const { Document, Packer, Paragraph } = await import('docx');

      // 图片检测
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let foundImage = false;
      outer: for (let pageIdx = 1; pageIdx <= numPages; pageIdx++) {
        const page = await pdf.getPage(pageIdx);
        const ops = await page.getOperatorList();
        for (let i = 0; i < ops.fnArray.length; i++) {
          const fn = ops.fnArray[i];
          if (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintImageMaskXObject) {
            foundImage = true;
            break outer;
          }
        }
      }
      if (foundImage) {
        setError("This PDF contains images or embedded graphics. Basic version only supports pure text PDFs. Please use Premium.");
        return;
      }

      // 提取文本
      const paragraphs: InstanceType<typeof Paragraph>[] = [];
      for (let i = 1; i <= numPages; i++) {
        setProgress(25 + ((i / numPages) * 60));
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((it: any) => it.str).join(' ');
        paragraphs.push(new Paragraph(pageText));
      }
      setProgress(90);
      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError("PDF parse failed. This file may be encrypted or corrupted.");
    } finally {
      setConverting(false);
    }
  }, [file]);

  const handleDownload = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${file.name.replace(/\.pdf$/i, '')}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const reset = () => {
    setFile(null);
    setConverting(false);
    setProgress(0);
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <span className={`text-sm font-normal px-2 py-0.5 rounded ${badgeColor}`}>{badgeText}</span>
        </CardTitle>
        <div className="mt-2 text-sm text-gray-600 space-y-1">
          {supportNotes.map((note, idx) => <p key={idx}>{note}</p>)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <FileUpload onFileSelect={setFile} maxSizeMB={25} />
          {converting && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">Processing: {progress}%</p>
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Button onClick={runConvert} disabled={!file || converting}>
              Convert to Word
            </Button>
            {downloadUrl && (
              <Button variant="secondary" onClick={handleDownload}>
                Download DOCX
              </Button>
            )}
            {(downloadUrl || error) && (
              <Button variant="outline" onClick={reset}>
                New Conversion
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
