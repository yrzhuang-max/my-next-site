'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';
import FAQAccordion from '@/components/FAQAccordion';

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
  // Basic Free 状态
  const [basicFile, setBasicFile] = useState<File | null>(null);
  const [basicConverting, setBasicConverting] = useState(false);
  const [basicProgress, setBasicProgress] = useState(0);
  const [basicDownloadUrl, setBasicDownloadUrl] = useState<string | null>(null);
  const [basicError, setBasicError] = useState<string | null>(null);

  // Premium 状态
  const [premiumFile, setPremiumFile] = useState<File | null>(null);
  const [premiumConverting, setPremiumConverting] = useState(false);
  const [premiumProgress, setPremiumProgress] = useState(0);
  const [premiumDownloadUrl, setPremiumDownloadUrl] = useState<string | null>(null);
  const [premiumError, setPremiumError] = useState<string | null>(null);

  // PDF检测：判断是否包含图片（基础版使用）
  const scanPdfForImages = useCallback(async (file: File): Promise<boolean> => {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    for (let pageIdx = 1; pageIdx <= numPages; pageIdx++) {
      const page = await pdf.getPage(pageIdx);
      const ops = await page.getOperatorList();
      for (let i = 0; i < ops.fnArray.length; i++) {
        const fn = ops.fnArray[i];
        if (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintImageMaskXObject) {
          return true;
        }
      }
    }
    return false;
  }, []);

  // 基础版转换：提取文本，生成标准docx
  const runBasicConvert = async () => {
    if (!basicFile) return;
    setBasicConverting(true);
    setBasicProgress(0);
    setBasicDownloadUrl(null);
    setBasicError(null);
    try {
      setBasicProgress(10);
      const foundImage = await scanPdfForImages(basicFile);
      if (foundImage) {
        setBasicError("This PDF contains images or embedded graphics. Basic version only supports pure text PDFs. Please use Premium.");
        return;
      }
      setBasicProgress(25);

      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs';
      const { Document, Packer, Paragraph } = await import('docx');

      const arrayBuffer = await basicFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const paragraphs: InstanceType<typeof Paragraph>[] = [];
      for (let i = 1; i <= numPages; i++) {
        setBasicProgress(25 + ((i / numPages) * 60));
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((it: any) => it.str).join(' ');
        paragraphs.push(new Paragraph(pageText));
      }
      setBasicProgress(90);

      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      setBasicDownloadUrl(url);
      setBasicProgress(100);
    } catch (err) {
      console.error(err);
      setBasicError("PDF parse failed. This file may be encrypted or corrupted.");
    } finally {
      setBasicConverting(false);
    }
  };

  // 高级版占位
  const runPremiumConvert = async () => {
    if (!premiumFile) return;
    setPremiumConverting(true);
    setPremiumProgress(0);
    setPremiumDownloadUrl(null);
    setPremiumError(null);
    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setPremiumProgress(i);
      }
      const { Document, Packer, Paragraph } = await import('docx');
      const doc = new Document({ sections: [{ children: [new Paragraph("Premium conversion result placeholder")] }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      setPremiumDownloadUrl(url);
    } catch (err) {
      setPremiumError("Conversion failed. Please try again or upload another PDF file.");
    } finally {
      setPremiumConverting(false);
    }
  };

  const handleDownload = (url: string | null, file: File | null) => {
    if (!url || !file) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.pdf$/i, '')}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const resetBasic = () => {
    setBasicFile(null);
    setBasicConverting(false);
    setBasicProgress(0);
    setBasicDownloadUrl(null);
    setBasicError(null);
  };
  const resetPremium = () => {
    setPremiumFile(null);
    setPremiumConverting(false);
    setPremiumProgress(0);
    setPremiumDownloadUrl(null);
    setPremiumError(null);
  };

  return (
    <main className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">PDF to Word Converter</h1>
          <p className="text-gray-500 mt-2">Choose the version that fits your document needs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Basic Free 卡片 */}
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
                {basicConverting && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-200"
                        style={{ width: `${basicProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Processing: {basicProgress}%</p>
                  </div>
                )}
                {basicError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm font-medium">{basicError}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={runBasicConvert} disabled={!basicFile || basicConverting}>
                    Convert to Word
                  </Button>
                  {basicDownloadUrl && (
                    <Button variant="secondary" onClick={() => handleDownload(basicDownloadUrl, basicFile)}>
                      Download DOCX
                    </Button>
                  )}
                  {(basicDownloadUrl || basicError) && (
                    <Button variant="outline" onClick={resetBasic}>
                      New Conversion
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium 卡片 */}
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
                <FileUpload onFileSelect={setPremiumFile} maxSizeMB={25} />
                {premiumConverting && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-200"
                        style={{ width: `${premiumProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Processing: {premiumProgress}%</p>
                  </div>
                )}
                {premiumError && (
                  <p className="text-red-600 text-sm font-medium">{premiumError}</p>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={runPremiumConvert} disabled={!premiumFile || premiumConverting}>
                    Convert to Word
                  </Button>
                  {premiumDownloadUrl && (
                    <Button variant="secondary" onClick={() => handleDownload(premiumDownloadUrl, premiumFile)}>
                      Download DOCX
                    </Button>
                  )}
                  {(premiumDownloadUrl || premiumError) && (
                    <Button variant="outline" onClick={resetPremium}>
                      New Conversion
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
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
