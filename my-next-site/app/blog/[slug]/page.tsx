import Button from '@/components/Button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/post';

// 关键新增：告诉Next构建时要预渲染哪几个slug
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | FileDocSwift`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
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
          <Link href="/blog" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">← Back to Blog</Link>
          <p className="text-sm text-gray-500 mb-3">{post.date}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{post.title}</h1>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/pdf-to-word">
              <Button>Convert PDF to Word Now</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}