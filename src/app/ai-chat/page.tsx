'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatInterface from './components/chat-interface';

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Header />

      {/* Alpine-style main container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-16 w-full flex-1">
        <main className="py-12">
          {/* Hero Section - Alpine style */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6 leading-tight">
              Cloud Recognition AI
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Upload cloud photos and chat with our AI to identify formations, analyze weather patterns, and discover atmospheric insights.
              </p>
            </div>
          </div>

          <ChatInterface />
        </main>

        <Footer />
      </div>
    </div>
  );
}
