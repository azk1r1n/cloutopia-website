'use client';

import Image from 'next/image';
import { Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/cloutopia-logo4.png"
            alt="Cloutopia Logo"
            width={1024}
            height={1024}
            className="w-12 h-12"
            priority
          />
          <h1 className="text-2xl font-semibold text-gray-900">Cloutopia</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
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
    </header>
  );
}
