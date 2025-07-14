'use client';

import { useRef } from 'react';
import { Paperclip, Send, X } from 'lucide-react';
import Image from 'next/image';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  uploadedImage?: string;
  onImageUpload: (file: File) => void;
  onRemoveImage: () => void;
  isDragOver: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
}

export default function ChatInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
  uploadedImage,
  onImageUpload,
  onRemoveImage,
  isDragOver,
  onDrop,
  onDragOver,
  onDragLeave,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
            onClick={onRemoveImage}
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
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
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
              if (file) onImageUpload(file);
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
  );
}
