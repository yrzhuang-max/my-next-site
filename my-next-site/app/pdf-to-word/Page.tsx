'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';
import FAQAccordion from '@/components/FAQAccordion';

// 广告组件，改成普通函数，不export default
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
    answer: "Yes, you can convert PDF to Word for free with basic limits. Large files may require longer processing time."
  },
  {
    question: "Will my original formatting be preserved?",
    answer: "Our tool attempts to retain text, tables and basic layout. Complex graphics or scanned image-only PDFs may have formatting changes after conversion."
  },
  {
    question: "Are my uploaded files secure?",
    answer: "All uploaded files are automatically deleted after conversion. We do not store or share your documents with third parties."
  },
  {
    question: "What file size limits apply?",
    answer: "Free conversion supports PDF files up to 25MB. For larger documents, split your PDF into smaller parts before uploading."
  },
  {
    question: "Can I convert scanned PDF files?",
    answer: "Scanned PDFs are image-based and require OCR. Our current free converter works best with text-based PDFs."
  }
];

// ✅ 唯一的页面默认导出
export default function PdfToWordPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 模拟转换，生产环境替换为真实API请求
  const simulateConversion = async () => {
    if (!pdfFile) return;
    setIsConverting(true);
    setProgress(0);
    setDownloadUrl(null);
    setError(null);
    try {
      // 模拟进度递增
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 250));
        setProgress(i);
      }
      // 生成模拟下载链接
      const fakeBlob = new Blob(["Mock Word content"], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = URL.createObjectURL(fakeBlob);
      setDownloadUrl(url);
    } catch (err) {
      setError("Conversion failed. Please try again or upload another PDF file.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl || !pdfFile) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${pdfFile.name.replace(/\.pdf$/i, '')}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const resetAll = () => {
    setPdfFile(null);
    setIsConverting(false);
    setProgress(0);
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <main className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>PDF to Word Converter</CardTitle>
            <p className="text-gray-500 mt-2">Convert PDF files to editable DOCX documents online.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <FileUpload onFileSelect={setPdfFile} maxSizeMB={25} />
              {/* 转换进度条 */}
              {isConverting && (
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
              {/* 错误提示 */}
              {error && (
                <p className="text-red-600 text-sm font-medium">{error}</p>
              )}
              {/* 操作按钮组 */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={simulateConversion} disabled={!pdfFile || isConverting}>
                  Convert to Word
                </Button>
                {downloadUrl && (
                  <Button variant="secondary" onClick={handleDownload}>
                    Download DOCX
                  </Button>
                )}
                {(downloadUrl || error) && (
                  <Button variant="outline" onClick={resetAll}>
                    New Conversion
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 广告位置，想展示就放这里 <AdUnit /> */}
        {/* <AdUnit /> */}

        {/* FAQ Section */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <FAQAccordion items={faqList}/>
        </div>
      </div>
    </main>
  );
}