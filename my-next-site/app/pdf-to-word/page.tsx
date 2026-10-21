import { FEATURE_FLAGS } from '@/lib/featureFlags';
import FreeBasicPanel from '@/components/pdfConverter/FreeBasicPanel';
import PremiumPanel from '@/components/pdfConverter/PremiumPanel';
import FAQAccordion from '@/components/FAQAccordion';

const faqList = [
  {
    question: "Is PDF to Word conversion free?",
    answer: "Yes, you can convert PDF to Word for free with basic limits. Large files may require longer processing time.",
  },
  {
    question: "Will my original formatting be preserved?",
    answer: "Our tool attempts to retain text, tables and basic layout. Complex graphics or scanned image‑only PDFs may have formatting changes after conversion.",
  },
  {
    question: "Are my uploaded files secure?",
    answer: "Files are processed temporarily and deleted after conversion. We do not store your uploaded PDFs permanently.",
  },
];

export default function PdfToWordPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-2">PDF to Word Converter</h1>
      <p className="text-gray-600 text-center mb-10">Extract text from PDF and export editable Word document</p>

      <div className="grid md:grid-cols-2 gap-6">
        <FreeBasicPanel />
        {/* 功能开关：本地开启才渲染真实PremiumPanel；线上关闭保持静态 */}
        {FEATURE_FLAGS.premiumPdfConvert ? <PremiumPanel /> : <PremiumPanel />}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">FAQs</h2>
        <FAQAccordion items={faqList} />
      </div>
    </main>
  );
}
