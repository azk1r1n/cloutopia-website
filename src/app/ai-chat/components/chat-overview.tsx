'use client';

import Image from 'next/image';
import { Cloud } from 'lucide-react';
import CloudCharacter from './cloud-character';

export default function ChatOverview() {
  return (
    <div className="max-w-[500px] mt-20 mx-4 md:mx-0">
      <div className="border-none bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400">
        <div className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
          <Image
            src="/assets/cloutopia-logo4.png"
            alt="Cloutopia Logo"
            width={1024}
            height={1024}
            className="w-8 h-8"
            priority
          />
          <span className="text-2xl font-bold">Cloutopia</span>
        </div>

        {/* Cloud Character with interactive eyes */}
        <CloudCharacter message="How can I help you today?" />
        
        <p className="text-center">
          Upload a photo of clouds or sky, and I&apos;ll help identify cloud formations and 
          analyze atmospheric conditions to guess the location.
        </p>
        
        <div className="grid grid-cols-1 gap-3 mt-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Cloud className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">Cloud Recognition</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">AI-powered cloud type identification</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">Location Insights</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Analyze patterns to estimate photo location</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs mt-2">
          💡 Tip: You can drag and drop images or click the attachment button below
        </p>
      </div>
    </div>
  );
}
