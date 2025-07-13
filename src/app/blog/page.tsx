'use client'

import Header from '../../components/Header'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight, Twitter, Instagram, Linkedin } from 'lucide-react'

const articles = [
  {
    id: 1,
    title: "Understanding Cumulus Clouds: Nature's Cotton Balls",
    excerpt: "Discover the fascinating world of cumulus clouds, their formation, and what they tell us about the weather. These puffy white clouds are more complex than they appear.",
    author: "Dr. Sarah Chen",
    date: "January 15, 2024",
    image: "/assets/cumulus-clouds.jpg",
    tags: ["Cloud Types", "Weather", "Education"],
    featured: true
  },
  {
    id: 2,
    title: "The Art of Storm Photography: Capturing Nature's Drama",
    excerpt: "Learn professional techniques for safely photographing storms and dramatic cloud formations. From equipment tips to composition secrets.",
    author: "Mark Rodriguez",
    date: "January 12, 2024",
    image: "/assets/storm-clouds.jpg",
    tags: ["Photography", "Storms", "Tutorial"]
  },
  {
    id: 3,
    title: "Climate Change and Cloud Patterns: What We're Learning",
    excerpt: "New research reveals how global climate change is affecting cloud formation patterns worldwide. Scientists are using AI to track these changes.",
    author: "Dr. Emily Watson",
    date: "January 10, 2024",
    image: "/assets/climate-clouds.jpg",
    tags: ["Climate", "Research", "Science"]
  },
  {
    id: 4,
    title: "Cirrus Clouds: The High-Altitude Messengers",
    excerpt: "These wispy, high-altitude clouds can predict weather changes 24-48 hours in advance. Learn to read their patterns and what they mean.",
    author: "Dr. Sarah Chen",
    date: "January 8, 2024",
    image: "/assets/cirrus-clouds.jpg",
    tags: ["Cloud Types", "Weather Prediction", "Education"]
  },
  {
    id: 5,
    title: "AI in Meteorology: The Future of Weather Prediction",
    excerpt: "How artificial intelligence is revolutionizing weather forecasting and cloud analysis. Explore the latest breakthroughs in atmospheric science.",
    author: "Prof. Michael Chang",
    date: "January 5, 2024",
    image: "/assets/ai-weather.jpg",
    tags: ["AI", "Technology", "Future"]
  }
]

export default function BlogPage() {
  const featuredArticle = articles.find(article => article.featured)
  const otherArticles = articles.filter(article => !article.featured)

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
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 mb-8">
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
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
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

        {/* Alpine-style Footer */}
        <footer className="flex flex-col items-center py-8 mt-24 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-8">
            <nav className="flex justify-center space-x-8 text-base font-medium">
              <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">About</Link>
              <Link href="/blog" className="text-blue-600 dark:text-blue-400">Articles</Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Contact</Link>
            </nav>
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Follow me on
          </p>
          
          <div className="flex justify-center space-x-4">
            <a 
              href="https://twitter.com/cloutopia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com/cloutopia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/company/cloutopia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
