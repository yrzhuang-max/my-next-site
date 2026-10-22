import type { Metadata } from 'next';
import FreeBasicPanel from '@/components/pdfConverter/FreeBasicPanel';
import PremiumPanel from '@/components/pdfConverter/PremiumPanel';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata: Metadata = {
  title: 'Free PDF to Word Converter | Convert PDF to DOCX Online',
  description:
    'Convert native text PDF to editable DOCX online for free. No registration, no email required. Max 10MB file limit. Scanned PDFs require Premium OCR.',
  metadataBase: new URL('https://www.filedocswift.com'),
  alternates: {
    canonical: '/pdf-to-word',
  },
  openGraph: {
    title: 'Free PDF to Word Converter | Convert PDF to DOCX Online',
    description:
      'Convert native text PDF to editable DOCX online for free. No registration, no email required. Max 10MB file limit. Scanned PDFs require Premium OCR.',
    url: '/pdf-to-word',
    type: 'website',
    images: [{ url: '/og-pdf-to-word.jpg', width: 1200, height: 630 }],
  },
};

const faqList = [
  {
    question: 'Is this PDF to Word converter free?',
    answer:
      'Yes. Our basic PDF to Word conversion is free with a 10MB file limit. It works for native text PDFs only. Scanned image PDFs need the Premium OCR feature.',
  },
  {
    question: 'Will my original formatting be preserved?',
    answer:
      'Our tool tries to retain text, tables and basic layout. Complex graphics or scanned image-only PDFs may have formatting changes after conversion.',
  },
  {
    question: 'Are my uploaded files secure?',
    answer:
      'Files are processed temporarily and deleted after conversion. We do not permanently store your uploaded PDFs.',
  },
];

const howToJson = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to convert PDF to DOCX for free',
  description: 'Convert native text PDF to editable Word DOCX online for free',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Upload your PDF',
      text: 'Upload a native text PDF, maximum 10MB for free conversion.',
    },
    {
      '@type': 'HowToStep',
      name: 'Start conversion',
      text: 'The server extracts content and builds an editable DOCX document.',
    },
    {
      '@type': 'HowToStep',
      name: 'Download DOCX',
      text: 'Download your Word file, uploaded files are deleted after processing.',
    },
  ],
};

const faqJson = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqList.map((q) => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.answer,
    },
  })),
};

export default function PdfToWordPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Free PDF to Word Converter</h1>
      <p className="text-gray-600 mb-10">
        Convert native text PDF into editable Microsoft Word DOCX instantly.
        Free, no registration and no downloads. Scanned image PDFs require our upcoming Premium OCR.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <FreeBasicPanel />
        <PremiumPanel />
      </div>

<section className="mt-16">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">How it works</h2>
  <div className="grid gap-6 md:grid-cols-3">
    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-800 mb-2">Upload your PDF</h3>
      <p className="text-sm text-gray-600">
        Upload a native text PDF, maximum 10MB for free conversion.
      </p>
    </div>
    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-800 mb-2">Start conversion</h3>
      <p className="text-sm text-gray-600">
        The server extracts content and builds an editable DOCX document.
      </p>
    </div>
    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-800 mb-2">Download DOCX</h3>
      <p className="text-sm text-gray-600">
        Download your Word file, uploaded files are deleted after processing.
      </p>
    </div>
  </div>
</section>

<section className="mt-16">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
  <FAQAccordion items={faqList} />
</section>

      {/* 原生script，服务端直接渲染进HTML，不要 import Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />
    </main>
  );
}
