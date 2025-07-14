'use client';

import { useParams } from 'next/navigation';
import { getArticleById } from '@/content/articles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock, User, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function ArticlePage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const article = getArticleById(id);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-blue-200">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {article.readTime}
              </div>
              <div className="text-blue-300">
                {article.date}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-6">
              {article.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-800/50 text-blue-200 border border-blue-700"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none space-y-4">
                <ReactMarkdown
                  components={{
                    h1: ({ children, ...props }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0" {...props}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8" {...props}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6" {...props}>
                        {children}
                      </h3>
                    ),
                    h4: ({ children, ...props }) => (
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4" {...props}>
                        {children}
                      </h4>
                    ),
                    p: ({ children, ...props }) => (
                      <p className="text-gray-700 mb-4 leading-relaxed" {...props}>
                        {children}
                      </p>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul className="list-disc pl-6 mb-4 space-y-2" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="list-decimal pl-6 mb-4 space-y-2" {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-gray-700" {...props}>
                        {children}
                      </li>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-6 my-6 text-gray-700 italic" {...props}>
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong className="font-semibold text-gray-900" {...props}>
                        {children}
                      </strong>
                    ),
                    em: ({ children, ...props }) => (
                      <em className="italic text-gray-700" {...props}>
                        {children}
                      </em>
                    ),
                    code: ({ children, ...props }) => (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props}>
                        {children}
                      </code>
                    ),
                    a: ({ children, ...props }) => (
                      <a 
                        className="text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    )
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to All Articles
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
