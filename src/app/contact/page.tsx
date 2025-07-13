'use client'

import Header from '../../components/Header'
import Link from 'next/link'
import { Mail, MapPin, Phone, Twitter, Instagram, Linkedin, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Alpine-style main container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-16">
        <main className="py-12">
          {/* Hero Section - Alpine style */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6 leading-tight">
              Get in Touch
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Have questions about cloud recognition, weather patterns, or want to collaborate? We'd love to hear from you.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
            {/* Contact Form - Alpine style */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8">
                Send us a message
              </h2>
              
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your first name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information - Alpine style */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">hello@cloutopia.com</p>
                    <p className="text-gray-600 dark:text-gray-400">support@cloutopia.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">Mon-Fri 9am-6pm PST</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Office</h3>
                    <p className="text-gray-600 dark:text-gray-400">San Francisco, CA</p>
                    <p className="text-gray-600 dark:text-gray-400">United States</p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                  Frequently Asked Questions
                </h3>
                
                <div className="space-y-4">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <span className="font-medium text-gray-800 dark:text-gray-200">How accurate is the cloud recognition?</span>
                      <span className="ml-2 text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                      Our AI achieves 95%+ accuracy in identifying major cloud types like cumulus, stratus, and cirrus. Accuracy improves with clear photos and good lighting conditions.
                    </div>
                  </details>
                  
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <span className="font-medium text-gray-800 dark:text-gray-200">Can I use Cloutopia offline?</span>
                      <span className="ml-2 text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                      Currently, Cloutopia requires an internet connection for AI processing. We're working on offline capabilities for basic cloud identification.
                    </div>
                  </details>
                  
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <span className="font-medium text-gray-800 dark:text-gray-200">Is my data secure?</span>
                      <span className="ml-2 text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                      Yes, we use enterprise-grade encryption and don't store your images permanently unless you choose to save them to your account.
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Alpine-style Footer */}
        <footer className="flex flex-col items-center py-8 mt-24 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-8">
            <nav className="flex justify-center space-x-8 text-base font-medium">
              <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">About</Link>
              <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Articles</Link>
              <Link href="/contact" className="text-blue-600 dark:text-blue-400">Contact</Link>
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
