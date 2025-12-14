'use client';

import { useRef } from 'react';
import { Paperclip, Send, X } from 'lucide-react';
import Image from 'next/image';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  uploadedFile?: File;
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
  uploadedFile,
  onImageUpload,
  onRemoveImage,
  isDragOver,
  onDrop,
  onDragOver,
  onDragLeave,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      {uploadedFile && (
        <div className="mb-3 relative inline-block">
          <Image
            src={URL.createObjectURL(uploadedFile)}
            alt="Uploaded cloud"
            width={300}
            height={200}
            className="max-w-xs max-h-48 rounded-lg border border-gray-200 dark:border-gray-700 object-cover shadow-sm"
          />
          <button
            onClick={onRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex items-end gap-2 bg-white dark:bg-gray-800 border rounded-3xl transition-all shadow-sm ${
            isDragOver
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20 border-2 shadow-md'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isDragOver ? "Drop your cloud image here..." : "Message Cloutopia AI..."}
            className="flex-1 min-h-[52px] max-h-[200px] px-5 py-3.5 bg-transparent border-none outline-none resize-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 text-[15px]"
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

          <div className="flex items-center gap-1 pr-2 pb-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={isLoading}
              aria-label="Upload image"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !uploadedFile)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Cloutopia AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
