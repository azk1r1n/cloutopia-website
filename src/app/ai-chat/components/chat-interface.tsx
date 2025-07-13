'use client';

import { useState, useRef } from 'react';
import ChatOverview from './chat-overview';
import ChatInput from './chat-input';
import ChatMessage from './chat-message';
import FloatingNav from './floating-nav';

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
          {messages.length === 0 && <ChatOverview />}

          <div className="w-full max-w-[500px] px-4 md:px-0">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

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
  );
}
