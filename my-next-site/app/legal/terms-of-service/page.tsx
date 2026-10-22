import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | FileDocSwift",
  description: "Terms of Service for FileDocSwift. Rules, disclaimers and liability terms for using our free PDF to Word online conversion service.",
  alternates: {
    canonical: "https://www.filedocswift.com/legal/terms-of-service/"
  }
};

export default function TermsOfServicePage() {
  return (
    <main className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: October 2026</p>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            These Terms of Service (“Terms”) govern access and use of filedocswift.com and our document conversion tools. By visiting or using our website, you accept these Terms. If you disagree, do not use our service.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
          <p>
            We provide online file conversion tools such as PDF to Word. The service is provided “as-is” and “as available” without warranties. We impose file size limits and usage limits to protect server stability.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must own or have legal rights to upload any documents</li>
            <li>Do not upload illegal, harmful, infringing, confidential or copyrighted material without permission</li>
            <li>You may not use bots, scraping or automated tools to abuse our conversion service</li>
            <li>Do not use our service to generate malware, fake documents or fraudulent content</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Intellectual Property</h2>
          <p>
            All website design, source code, branding, text and graphics on filedocswift.com are our intellectual property. You retain ownership of the documents you upload and convert.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Disclaimer of Warranties</h2>
          <p>
            We do not guarantee perfect formatting on converted files. Scanned/image-only PDFs may produce low-quality output. We make no guarantee that service will run uninterrupted, error-free or secure.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, filedocswift.com shall not be liable for any direct, indirect, incidental or consequential damages arising from use or inability to use our tool, including loss of data or formatting errors.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Termination</h2>
          <p>
            We reserve the right to block or restrict access for users abusing our service, violating copyright or breaking these terms.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Modifications</h2>
          <p>
            We may update these Terms at any time. Changes are effective once published on this page. Continued use after changes constitutes acceptance.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h2>
          <p>Questions regarding these Terms: <a href="mailto:contact@filedocswift.com" className="text-blue-600 hover:underline">contact@filedocswift.com</a></p>
        </section>
      </div>
    </main>
  );
}