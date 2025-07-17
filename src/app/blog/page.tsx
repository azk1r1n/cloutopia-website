'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { getFeaturedArticle, getOtherArticles } from '@/content/articles'

export default function BlogPage() {
  const featuredArticle = getFeaturedArticle()
  const otherArticles = getOtherArticles()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Alpine-style main container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-16">
        <main className="py-12">
          {/* Hero Section - Alpine style */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6 leading-tight">
              Cloud Stories & Insights
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Explore the fascinating world of clouds, weather patterns, and atmospheric science through our collection of articles and research.
              </p>
            </div>
          </div>

          {/* Featured Article - Alpine style */}
          {featuredArticle && (
            <article className="mb-16 group">
              <Link href={`/blog/${featuredArticle.id}`}>
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 mb-8 cursor-pointer">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    width={800}
                    height={400}
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-4 text-white/80 text-sm mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{featuredArticle.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{featuredArticle.date}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-blue-200 transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-white/90 text-base leading-relaxed mb-4">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featuredArticle.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Articles Grid - Alpine style */}
          <div className="space-y-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8">
              Latest Articles
            </h2>
            
            <div className="space-y-8">
              {otherArticles.map((article) => (
                <article key={article.id} className="group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={article.image}
                          alt={article.title}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 text-sm mb-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{article.date}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Link
                        href={`/blog/${article.id}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                      >
                        Read more
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Newsletter Section - Alpine style */}
          <div className="mt-24 mb-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Get the latest articles about clouds, weather patterns, and atmospheric science delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
