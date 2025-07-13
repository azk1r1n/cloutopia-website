'use client'

import Header from '../../components/Header'
import { Cloud, Camera, MessageSquare, PenTool, Zap, Globe } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover the Sky with AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cloutopia is an AI-powered cloud recognition platform that helps you identify cloud types, 
            understand weather patterns, and create beautiful stories from your sky observations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cloud className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cloud Recognition</h3>
            <p className="text-gray-600">
              AI-powered identification of cumulus, stratus, cirrus, and other cloud types with detailed explanations.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Location Insights</h3>
            <p className="text-gray-600">
              Analyze weather patterns and lighting to estimate where your cloud photos were taken.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <PenTool className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Blog Creation</h3>
            <p className="text-gray-600">
              Turn your cloud discoveries into shareable blog posts and educational content.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Photo Analysis</h3>
            <p className="text-gray-600">
              Upload any sky photo and get instant analysis of cloud formations and atmospheric conditions.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive Chat</h3>
            <p className="text-gray-600">
              Ask questions about clouds, weather patterns, and atmospheric science in natural conversation.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Results</h3>
            <p className="text-gray-600">
              Get immediate AI-powered analysis with confidence scores and detailed explanations.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How Cloutopia Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload Your Photo</h3>
              <p className="text-gray-600">
                Drag and drop or select any cloud photo from your device. Our AI works with photos from any camera or smartphone.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes cloud types, weather patterns, lighting conditions, and atmospheric data.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Explore & Share</h3>
              <p className="text-gray-600">
                Chat with AI about your clouds, learn about weather science, and create blog posts to share your discoveries.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Explore the Sky?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your cloud recognition journey today. Upload a photo and discover the fascinating world above us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Analyzing Clouds
            </Link>
            <Link
              href="/blog"
              className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Read Cloud Stories
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cloutopia</h3>
            <nav className="flex justify-center space-x-8 mb-8">
              <Link href="/" className="text-blue-600 font-medium">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">Articles</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
            <p className="text-gray-500 text-sm">Discover the sky with artificial intelligence</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
