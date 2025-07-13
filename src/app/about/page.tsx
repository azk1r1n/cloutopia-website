'use client'

import Header from '../../components/Header'
import { Cloud, Camera, MessageSquare, PenTool, Zap, Globe, Twitter, Instagram, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Alpine-style main container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-16">
        <main className="py-12">
          {/* Hero Section - Alpine style */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6 leading-tight">
              Discover the Sky with AI
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Cloutopia is an AI-powered cloud recognition platform that helps you identify cloud types, 
                understand weather patterns, and create beautiful stories from your sky observations.
              </p>
            </div>
          </div>

          {/* Features Grid - Alpine style */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                <Cloud className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Cloud Recognition</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                AI-powered identification of cumulus, stratus, cirrus, and other cloud types with detailed explanations.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Location Insights</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Analyze atmospheric patterns and lighting to estimate where your 
                  cloud photos were taken around the world.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                <PenTool className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Blog Creation</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Turn your cloud discoveries into shareable blog posts and educational content.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors">
                <Camera className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Photo Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Upload any sky photo and get instant analysis of cloud formations and atmospheric conditions.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                <MessageSquare className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Interactive Chat</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Ask questions about clouds, weather patterns, and atmospheric science in natural conversation.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/50 transition-colors">
                <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Instant Results</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Get immediate AI-powered analysis with confidence scores and detailed explanations.
              </p>
            </div>
          </div>

          {/* How It Works Section - Alpine style */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-12">
              How Cloutopia Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Upload Your Photo</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Drag and drop or select any cloud photo from your device. Our AI works with photos from any camera or smartphone.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our advanced AI analyzes cloud types, weather patterns, lighting conditions, and atmospheric data.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Explore & Share</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Chat with AI about your clouds, learn about weather science, and create blog posts to share your discoveries.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action - Alpine style */}
          <div className="text-center mb-24">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Ready to Explore the Sky?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start your cloud recognition journey today. Upload a photo and discover the fascinating world above us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                Start Analyzing Clouds
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
              >
                Read Cloud Stories
              </Link>
            </div>
          </div>
        </main>

        {/* Alpine-style Footer */}
        <footer className="flex flex-col items-center py-8 mt-24 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-8">
            <nav className="flex justify-center space-x-8 text-base font-medium">
              <Link href="/about" className="text-blue-600 dark:text-blue-400">About</Link>
              <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Articles</Link>
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
