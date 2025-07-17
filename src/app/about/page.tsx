import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Cloud, Camera, MessageSquare, ArrowRight, Globe, PenTool } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-8">
              <Image
                src="/assets/cloutopia-logo4.png"
                alt="Cloutopia Logo"
                width={1024}
                height={1024}
                className="w-16 h-16 md:w-20 md:h-20"
                priority
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Discover the Sky with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Upload any cloud photo and let our AI identify formations, analyze weather patterns, 
              and estimate locations with precision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/ai-chat"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Camera className="w-5 h-5" />
                Start Analyzing Clouds
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                Read Cloud Stories
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Powered by Advanced AI
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Cloutopia combines cutting-edge computer vision with atmospheric science 
                to deliver instant, accurate cloud analysis.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                  <Cloud className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Cloud Recognition
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Instantly identify cumulus, stratus, cirrus, and other cloud types with 
                  detailed explanations and confidence scores.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Location Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Analyze atmospheric patterns and lighting to estimate where your 
                  cloud photos were taken around the world.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 hover:shadow-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-6">
                  <PenTool className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Blog Generation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Turn your cloud discoveries and stories into shareable blog posts and educational contents.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How Cloutopia Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Three simple steps to unlock the secrets of the sky
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Upload Your Photo
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Drag and drop or select any cloud photo from your device. 
                  Our AI works with photos from any camera or smartphone.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  AI Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our advanced AI analyzes cloud types, weather patterns, 
                  lighting conditions, and atmospheric data in seconds.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Explore & Learn
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Chat with AI about your clouds, learn about weather science, 
                  and discover fascinating atmospheric phenomena.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Explore the Sky?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Start your cloud recognition journey today. Upload a photo and 
              discover the fascinating world above us.
            </p>
            
            <Link
              href="/ai-chat"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-orange-500 text-white text-xl font-semibold rounded-2xl hover:from-blue-700 hover:to-orange-600 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <Camera className="w-6 h-6" />
              Start Analyzing Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
