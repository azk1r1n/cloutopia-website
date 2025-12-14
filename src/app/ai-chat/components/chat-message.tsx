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
    <div className="w-full">
      <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-blue-600 dark:bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            {isUser ? <User className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className={`${isUser ? 'flex flex-col items-end' : ''}`}>
            {message.image && (
              <div className={`mb-3 ${isUser ? '' : 'max-w-lg'}`}>
                <Image
                  src={message.image}
                  alt="Uploaded cloud"
                  width={400}
                  height={300}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm object-cover"
                />
              </div>
            )}

            {message.content && (
              <div className={`${isUser ? 'max-w-lg' : 'max-w-none'}`}>
                {isUser ? (
                  <div className="bg-blue-600 dark:bg-blue-500 text-white rounded-2xl px-4 py-2.5 inline-block">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                ) : (
                  <div className="text-gray-900 dark:text-gray-100 prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-gray-800 dark:text-gray-200">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-1 text-gray-800 dark:text-gray-200">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 space-y-1 text-gray-800 dark:text-gray-200">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                        code: ({ children }) => (
                          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-900 dark:text-gray-100">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm my-3">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
