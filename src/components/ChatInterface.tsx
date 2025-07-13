'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, X, Cloud, User } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import FloatingNav from './FloatingNav';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | undefined>();
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
  };

  const handleRemoveImage = () => {
    setUploadedImage(undefined);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleImageUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const generateCloudResponse = (userInput: string, hasImage: boolean): string => {
    if (hasImage) {
      return `I can see the cloud formation in your image! Based on the atmospheric patterns and cloud structures, this appears to be a ${['cumulus', 'stratus', 'cirrus', 'nimbus'][Math.floor(Math.random() * 4)]} cloud formation. 

The atmospheric conditions suggest this could be taken in a ${['temperate', 'subtropical', 'continental', 'maritime'][Math.floor(Math.random() * 4)]} climate region. The cloud patterns and lighting conditions are consistent with locations in areas like ${['the Pacific Northwest', 'the Mediterranean region', 'the Great Plains', 'coastal California'][Math.floor(Math.random() * 4)]}.

Would you like me to analyze any specific aspects of the atmospheric conditions or cloud formations in more detail?`;
    }
    
    return `I'd be happy to help you identify cloud formations and analyze atmospheric conditions! You can describe what you see in the sky, or better yet, upload a photo of the clouds you'd like me to analyze. 

I can help identify:
- Cloud types (cumulus, stratus, cirrus, etc.)
- Weather patterns
- Potential geographic regions based on atmospheric conditions
- Time of day estimates based on lighting

Feel free to share an image or describe what you're observing!`;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !uploadedImage) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: uploadedImage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setUploadedImage(undefined);
    setIsLoading(true);

    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateCloudResponse(input, !!uploadedImage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
      scrollToBottom();
    }, 1000);
  };

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <FloatingNav />
      <div className="flex flex-col justify-center max-w-[500px] w-full gap-4">
        <div className="flex flex-col gap-4 h-full w-full items-center overflow-y-auto">
          {messages.length === 0 && (
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
                <p className="text-center text-zinc-900 dark:text-zinc-50 text-lg font-medium">
                  How can I help you today?
                </p>
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
          )}

          <div className="w-full max-w-[500px] px-4 md:px-0">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div key={message.id} className={`flex gap-4 p-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 ${isUser ? 'order-2' : 'order-1'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}>
                      {isUser ? <User className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                    </div>
                  </div>
                  
                  <div className={`flex-1 ${isUser ? 'order-1' : 'order-2'}`}>
                    <div className={`max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
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
                      
                      <div className={`rounded-2xl px-4 py-3 ${
                        isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
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
            })}

            {isLoading && (
              <div className="flex flex-row gap-4 px-4 w-full md:px-0 mb-6">
                <div className="flex flex-col space-y-1.5 leading-1.5 border-gray-200 bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Analyzing...
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="mx-4 md:mx-0 relative">
          {uploadedImage && (
            <div className="mb-4 relative inline-block">
              <Image
                src={uploadedImage}
                alt="Uploaded cloud"
                width={300}
                height={200}
                className="max-w-xs max-h-48 rounded-lg border border-gray-200 dark:border-gray-700 object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div
              className={`relative flex-1 min-h-[48px] max-h-[200px] overflow-hidden bg-gray-50 dark:bg-gray-900 border-2 rounded-2xl transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-950' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isDragOver ? "Drop your cloud image here..." : "Describe what you see in the clouds, or upload an image..."}
                className="w-full h-full min-h-[48px] max-h-[200px] px-4 py-3 pr-12 bg-transparent border-none outline-none resize-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                accept="image/*"
                className="hidden"
              />
              
              <div className="absolute right-2 bottom-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !uploadedImage)}
              className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[48px] flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
