import Button from '@/components/Button';

export const metadata = {
  title: 'Page Not Found | FileDocSwift',
  description: 'The page you requested cannot be found.',
};

export default function NotFoundPage() {
  return (
    <main className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the page you are looking for does not exist or may have been moved.
        </p>
        <a href="/">
          <Button size="lg">Back to Home</Button>
        </a>
      </div>
    </main>
  );
}