import Button from '@/components/Button';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/post';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | FileDocSwift`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.isoDate,
    publisher: {
      "@type": "Organization",
      name: "FileDocSwift",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <a href="/blog/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">← Back to Blog</a>
          <p className="text-sm text-gray-500 mb-3">{post.date}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{post.title}</h1>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="mt-12 pt-8 border-t border-gray-200">
            <a href="/pdf-to-word/">
              <Button>Convert PDF to Word Now</Button>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}