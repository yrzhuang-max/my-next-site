import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FileDocSwift",
  description: "Privacy Policy for FileDocSwift. Learn how we collect, use, store and protect your data and uploaded documents on our PDF conversion tool.",
  alternates: {
    canonical: "https://www.filedocswift.com/legal/privacy-policy/"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: October 2026</p>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
          <p className="mb-4">
            Welcome to filedocswift.com (“Website”, “we”, “us”, “our”). This Privacy Policy describes how we collect, use, store, and protect your information when you use our online document conversion tools, including PDF to Word converter.
          </p>
          <p>
            By accessing and using our website, you agree to the practices described in this Privacy Policy. If you do not agree, please do not use our services.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
          <p className="mb-2"><strong>Uploaded Documents:</strong> When you upload PDF files for conversion, your files are temporarily processed on our server. Uploaded documents are automatically deleted after conversion completes or after a short retention period. We do not sell, share or view the content of your uploaded files for commercial purposes.</p>
          <p className="mb-2"><strong>Automatically Collected Data:</strong> We automatically collect non-personal data including IP address, browser type, device type, page visits, referral URLs and usage statistics via Google Analytics and advertising partners.</p>
          <p><strong>Cookies:</strong> We use cookies as described in our <a href="/legal/cookie-policy/" className="text-blue-600 underline">Cookie Policy</a>.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and operate the document conversion service</li>
            <li>Monitor website performance, fix bugs and improve our tools</li>
            <li>Display relevant advertisements via Google AdSense</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing</h2>
          <p>
            We do not sell your personal information to third parties. We may share limited anonymous traffic data with our analytics and advertising providers such as Google. We will disclose information if required by law, court order or government request.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
          <p>
            Uploaded document files are temporary and automatically removed after conversion. Analytics data may be stored for up to 24 months in anonymized form.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights (GDPR / CCPA)</h2>
          <p className="mb-2">If you are located in the European Economic Area or California, you have rights including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request access to your personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent for analytics or advertising cookies</li>
            <li>Data portability</li>
          </ul>
          <p className="mt-2">Contact us at <a href="mailto:contact@filedocswift.com" className="text-blue-600 hover:underline">contact@filedocswift.com</a> to submit a request.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Security</h2>
          <p>
            We implement reasonable technical safeguards to protect uploaded files and visitor data, but no online transmission or storage is 100% secure.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes To This Policy</h2>
          <p>
            We may update this Privacy Policy. Material changes will be posted on this page with updated date. Continued website use after updates means you accept the revised policy.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h2>
          <p>If you have privacy questions, contact us: <a href="mailto:contact@filedocswift.com" className="text-blue-600 hover:underline">contact@filedocswift.com</a></p>
        </section>
      </div>
    </main>
  );
}