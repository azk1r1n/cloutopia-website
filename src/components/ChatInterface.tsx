'use client';

import { useState } from 'react';
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      image: uploadedImage || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedImage(null);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(input, !!uploadedImage),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, hasImage: boolean) => {
    if (hasImage) {
      return "I can see the cloud formation in your image! Based on the cloud patterns and atmospheric conditions, this appears to be a cumulonimbus cloud formation. The distinctive anvil shape and towering structure suggest this photo was likely taken in a temperate climate zone, possibly during late afternoon when thermal updrafts are strongest. The lighting and atmospheric conditions could indicate this was taken in the American Midwest or similar continental climate region. Would you like me to analyze any specific aspects of the cloud formation or atmospheric conditions?";
    }
    return "I'd be happy to help you identify cloud formations and analyze atmospheric conditions! Please upload an image of the sky or clouds you'd like me to examine, and I'll do my best to identify the cloud types, weather patterns, and potentially provide insights about the location based on the atmospheric conditions visible in the photo.";
  };

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle paste events for images
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    
    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setUploadedImage(result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Drag and drop handlers for the entire chat area
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only hide if leaving the main container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      // Check file size (max 10MB)
      if (imageFile.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImage(result);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  return (
    <div 
      className="flex flex-col h-full relative min-h-0"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag and Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white border-2 border-dashed border-blue-500 rounded-2xl p-8 max-w-md mx-4 shadow-lg">
            <div className="text-center">
              <ImageIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Drop your cloud image here</h3>
              <p className="text-gray-600">Drag and drop to upload cloud or sky photos for analysis</p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center overflow-y-auto p-4">
          <div className="text-center max-w-2xl mx-auto px-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              How can I help you today?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Upload a photo of clouds or sky, and I&apos;ll help identify cloud formations and analyze atmospheric conditions to guess the location.
            </p>
            
            {/* Upload suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <ImageIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="text-gray-900 font-medium mb-1">Cloud Photos</h3>
                <p className="text-gray-600 text-sm">Upload pictures of clouds for identification</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mx-auto mb-2"></div>
                <h3 className="text-gray-900 font-medium mb-1">Sky Views</h3>
                <p className="text-gray-600 text-sm">Share atmospheric patterns and weather</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-2"></div>
                <h3 className="text-gray-900 font-medium mb-1">Location Guess</h3>
                <p className="text-gray-600 text-sm">Get insights about where photo was taken</p>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm">
              💡 Tip: You can drag and drop images anywhere on this page, or click the upload button below
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 border border-gray-200'
                }`}
              >
                {message.image && (
                  <div className="mb-3">
                    <img
                      src={message.image}
                      alt="Uploaded"
                      className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                    />
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <div className={`text-xs opacity-70 mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-gray-700">Analyzing...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {uploadedImage && (
          <div className="mb-3 relative inline-block">
            <img
              src={uploadedImage}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg border border-gray-300"
            />
            <button
              onClick={() => setUploadedImage(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="flex gap-3 items-end">
          <ImageUpload onImageUpload={handleImageUpload} />
          
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onPaste={handlePaste}
              placeholder="Ask a question or paste an image..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
              rows={1}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() && !uploadedImage}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
