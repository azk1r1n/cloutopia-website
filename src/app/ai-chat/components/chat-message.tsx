'use client';

import { User, Cloud } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-blue-600 dark:bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
          {isUser ? <User className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
        </div>
      </div>

      <div className={`flex-1 ${isUser ? 'order-1' : 'order-2'}`}>
        <div className={`max-w-[90%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
          {message.image && (
            <div className="mb-3">
              <Image
                src={message.image}
                alt="Uploaded cloud"
                width={400}
                height={300}
                className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm object-cover"
              />
            </div>
          )}
          
          <div className={`rounded-xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-blue-600 dark:bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
          }`}>
            {isUser ? (
              <p className="text-sm">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                    code: ({ children }) => (
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto text-xs">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
