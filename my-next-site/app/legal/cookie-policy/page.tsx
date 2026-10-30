import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | FileDocSwift",
  description: "Cookie Policy for FileDocSwift. Learn how we use necessary, analytics and advertising cookies from Google Analytics and AdSense.",
  alternates: {
    canonical: "https://www.filedocswift.com/legal/cookie-policy"
  }
};

export default function CookiePolicyPage() {
  return (
    <main className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: October 2026</p>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. What Are Cookies</h2>
          <p>
            Cookies are small text files saved to your browser when you visit a website. They help remember preferences, analyze traffic and serve personalized advertisements.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Cookie Types We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Necessary Cookies</h3>
              <p>Required for website basic function, including storing your cookie consent choice. Cannot be disabled.</p>
            </div>
            <div>
              <h3 className="font-semibold">Analytics Cookies</h3>
              <p>Provided by Google Analytics. Collect anonymous usage data to understand visitor behavior and improve the website.</p>
            </div>
            <div>
              <h3 className="font-semibold">Advertising Cookies</h3>
              <p>Google AdSense cookies used to serve relevant ads, measure ad performance. Only loaded after your consent.</p>
            </div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Your Cookie Choices</h2>
          <p className="mb-3">
            When you first visit our site, our Cookie Banner lets you Accept All or Reject Non-Essential cookies.
          </p>
          <p>
            You can manage or delete cookies through your browser settings. If you reject non-essential cookies, analytics and personalized ads will not load.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Cookies</h2>
          <p>
            Google Analytics and Google AdSense may set their own cookies on your device. Their data collection is governed by Google’s own privacy policy.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Policy Updates</h2>
          <p>
            We may update this Cookie Policy periodically. Changes will be posted on this page.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
          <p>Cookie related inquiries: <a href="mailto:contact@filedocswift.com" className="text-blue-600 hover:underline">contact@filedocswift.com</a></p>
        </section>
      </div>
    </main>
  );
}