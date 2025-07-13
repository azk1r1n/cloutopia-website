'use client';

import Image from 'next/image';
import { Settings, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/cloutopia-logo4.png"
            alt="Cloutopia Logo"
            width={1024}
            height={1024}
            className="w-12 h-12"
            priority
          />
          <h1 className="text-2xl font-semibold text-gray-900">Cloutopia</h1>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
          About
        </Link>
        <Link href="/blog" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
          Articles
        </Link>
        <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
          Contact
        </Link>
      </nav>
      
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Settings and Auth buttons */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Sign In
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Sign Up
          </button>
        </div>
        <div className="sm:hidden">
          <button className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Sign Up
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 md:hidden">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/blog" 
              className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Articles
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
