import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides and tips for PDF and document conversion. Learn how to convert PDF to Word and manage your digital documents easily.",
  alternates: {
    canonical: '/blog',
  },
};
import { blogPosts } from '@/lib/post';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';

export default function BlogListPage() {
  return (
    <main className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Useful guides, tips and tutorials about PDF files, document conversion and digital document management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.slug}>
              <CardHeader>
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
             <CardContent>
                <p className="text-gray-600 mb-6">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`}>
                <Button variant="outline">Read More</Button>
                </Link>
            </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}