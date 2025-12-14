'use client';

import Header from '@/components/Header';
import ChatInterface from './components/chat-interface';

export default function AIChatPage() {
  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
      <Header />
      <ChatInterface />
    </div>
  );
}
