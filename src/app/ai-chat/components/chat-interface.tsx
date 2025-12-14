'use client';

import { useState, useRef, useEffect } from 'react';
import { Cloud } from 'lucide-react';
import ChatOverview from './chat-overview';
import ChatInput from './chat-input';
import ChatMessage from './chat-message';
import { fileToBase64 } from '@/lib/utils/imageUtils';
import { fileToBase64 } from '@/lib/utils/imageUtils';

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
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const [isDragOver, setIsDragOver] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if user is near bottom of scroll container
  const isNearBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    const threshold = 100; // pixels from bottom
    const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return scrollBottom < threshold;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-scroll during streaming only if user is near bottom
  useEffect(() => {
    if (isStreaming && streamingMessage && isNearBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamingMessage, isStreaming]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = (file: File) => {
    setUploadedFile(file);
    setUploadedFile(file);
  };

  const handleRemoveImage = () => {
    setUploadedFile(undefined);
    setUploadedFile(undefined);
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

  async function streamChatResponse(message: string, imageFile?: File): Promise<string> {
    // Convert image to base64 if provided
    let imageBase64: string | null = null;
    if (imageFile) {
      imageBase64 = await fileToBase64(imageFile);
    }

    // Make SSE request to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        image: imageBase64
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse SSE stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let accumulatedContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'token' && data.content) {
              accumulatedContent += data.content;
              setStreamingMessage(accumulatedContent);
            } else if (data.type === 'error') {
              throw new Error(data.message || 'Unknown error');
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError);
          }
        }
      }
    }

    return accumulatedContent;
  }
  async function streamChatResponse(message: string, imageFile?: File): Promise<string> {
    // Convert image to base64 if provided
    let imageBase64: string | null = null;
    if (imageFile) {
      imageBase64 = await fileToBase64(imageFile);
    }

    // Make SSE request to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        image: imageBase64
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse SSE stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let accumulatedContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'token' && data.content) {
              accumulatedContent += data.content;
              setStreamingMessage(accumulatedContent);
            } else if (data.type === 'error') {
              throw new Error(data.message || 'Unknown error');
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError);
          }
        }
      }
    }

    return accumulatedContent;
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !uploadedFile) return;
    if (!input.trim() && !uploadedFile) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined,
      image: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    const messageText = input;
    const messageText = input;
    setInput('');
    const fileToSend = uploadedFile;
    setUploadedFile(undefined);
    setIsStreaming(true);
    setStreamingMessage('');

    try {
      const fullResponse = await streamChatResponse(messageText, fileToSend);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error streaming response:', error);
      const errorMessage: Message = {
    const fileToSend = uploadedFile;
    setUploadedFile(undefined);
    setIsStreaming(true);
    setStreamingMessage('');

    try {
      const fullResponse = await streamChatResponse(messageText, fileToSend);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error streaming response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please make sure the backend server is running and try again.',
        content: 'Sorry, I encountered an error processing your request. Please make sure the backend server is running and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
      scrollToBottom();
    }
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Messages Area - Full height scrollable */}
      <div
        ref={scrollContainerRef}
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

            {/* Show streaming message only when there's actual content */}
            {isStreaming && streamingMessage && (
              <ChatMessage
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: streamingMessage,
                  timestamp: new Date(),
                }}
              />
            )}

            {/* Show loading animation only when waiting for first words */}
            {isStreaming && !streamingMessage && (
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
            isLoading={isStreaming}
            uploadedFile={uploadedFile}
            isLoading={isStreaming}
            uploadedFile={uploadedFile}
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
