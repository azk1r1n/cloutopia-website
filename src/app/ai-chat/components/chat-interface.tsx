'use client';

import { useState, useRef, useEffect } from 'react';
import { Cloud } from 'lucide-react';
import ChatOverview from './chat-overview';
import ChatInput from './chat-input';
import ChatMessage from './chat-message';

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Messages Area - Full height scrollable */}
      <div
        className="flex-1 overflow-y-auto"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 && <ChatOverview />}

          <div className="space-y-8">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex flex-row gap-4 w-full max-w-3xl mx-auto">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Cloud className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="flex items-center space-x-1 py-2">
                  <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500/10 border-4 border-dashed border-blue-500 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              Drop your cloud image here
            </p>
          </div>
        </div>
      )}

      {/* Input Area - Sticky at bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <ChatInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            uploadedImage={uploadedImage}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            isDragOver={isDragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          />
        </div>
      </div>
    </div>
  );
}
