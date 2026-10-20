import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';

export const metadata = {
  title: 'FileDocSwift | Free Online Document Converter',
  description: 'Convert PDF to Word online for free. Turn static PDF files into editable DOCX documents quickly, no registration required.',
};

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fast & Free Online Document Conversion
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            FileDocSwift helps you convert static PDF files into fully editable Microsoft Word DOCX documents.
            No sign-up, no software download, just upload and convert instantly.
          </p>
          <a href="/pdf-to-word/">
            <Button size="lg">Convert PDF to Word Now</Button>
          </a>
        </div>
      </section>

      {/* Feature Card Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Choose FileDocSwift?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simple & Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upload your PDF and get editable Word files within seconds. No complicated settings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>No Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You do not need to create an account. Use our PDF converter completely without sign-up.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Secure Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Uploaded files are automatically deleted after conversion. Your documents stay private.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tool Preview Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our First Tool: PDF to Word Converter</h2>
          <p className="text-gray-600 mb-8">
            Convert text-based PDFs into editable .docx files. Preserve text content, tables and basic document layout.
          </p>
          <a href="/pdf-to-word/">
            <Button size="lg" variant="outline">Go to PDF to Word Converter</Button>
          </a>
        </div>
      </section>
    </main>
  );
}