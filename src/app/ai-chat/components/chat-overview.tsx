'use client';

import Image from 'next/image';
import { Cloud } from 'lucide-react';
import CloudCharacter from './cloud-character';

export default function ChatOverview() {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/assets/cloutopia-logo4.png"
            alt="Cloutopia Logo"
            width={1024}
            height={1024}
            className="w-16 h-16"
            priority
          />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Cloutopia AI
          </h2>
        </div>

        {/* Cloud Character with interactive eyes */}
        <CloudCharacter message="How can I help you analyze clouds today?" />

        <p className="text-base text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
          Upload a photo of clouds or sky, and I&apos;ll help identify cloud formations and
          analyze atmospheric conditions.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                Cloud Recognition
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Identify cloud types and formations
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-pink-500 rounded"></div>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                Location Insights
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Estimate photo location from patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
