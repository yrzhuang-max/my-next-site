import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | FileDocSwift',
  description: 'Learn about FileDocSwift, our mission to provide simple, secure free online document conversion tools including PDF to Word.',
  alternates: {
    canonical: 'https://www.filedocswift.com/about',
  },
}

export default function AboutPage() {
  return (
    <main className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About FileDocSwift</h1>
        <p className="mb-6 text-lg">
          FileDocSwift is a free online document converter focused on simple, fast file transformation tools for users worldwide. Our first tool is the PDF to Word converter, designed to turn static PDF documents into editable DOCX files.
        </p>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h2>
          <p className="mb-4">
            We aim to make document conversion quick and accessible for everyone. No software downloads, no complicated registration. Upload your file, convert it, and download the result in just a few clicks.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Security Promise</h2>
          <p className="mb-4">
            We respect your document privacy. All uploaded files are temporarily processed and automatically deleted after conversion. We do not store or read your documents for other purposes.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">What tools we offer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>PDF to Word Converter (DOCX)</li>
            <li>More document tools coming soon</li>
          </ul>
        </section>
      </div>
    </main>
  );
}