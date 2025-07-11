'use client'

import { useState } from 'react'
import { Upload, Send, Cloud, MapPin } from 'lucide-react'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'assistant'
    content: string
    image?: string
  }>>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSendMessage = () => {
    if (!message.trim() && !selectedFile) return

    const newMessage = {
      type: 'user' as const,
      content: message || 'Uploaded an image',
      image: selectedFile ? URL.createObjectURL(selectedFile) : undefined
    }

    setChatHistory(prev => [...prev, newMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'assistant' as const,
        content: selectedFile 
          ? "I can see beautiful clouds in your image! These appear to be cumulus clouds, likely photographed in a temperate region. The fluffy, white appearance suggests fair weather conditions. Based on the lighting and cloud formation, this could be taken during late morning or early afternoon. Can you tell me more about when and where this photo was taken?"
          : "I'm here to help you identify clouds and guess locations from your photos! Please upload an image and I'll analyze the cloud types and try to determine the location."
      }
      setChatHistory(prev => [...prev, aiResponse])
    }, 1000)

    setMessage('')
    setSelectedFile(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Cloutopia</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-blue-600 font-medium">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Blog</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Login</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Clouds with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your sky photos and chat with our AI to identify cloud types and guess locations. 
            Turn your conversations into beautiful blog posts!
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Chat History */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 border-b">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <Cloud className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Upload a cloud photo to start the conversation!</p>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <p>{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-6">
            <div className="flex items-center space-x-4">
              {/* File Upload */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Upload className="h-5 w-5 text-gray-600" />
                </div>
              </label>

              {/* Selected File Indicator */}
              {selectedFile && (
                <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded">
                  {selectedFile.name}
                </span>
              )}

              {/* Message Input */}
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about the clouds, weather, or location..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() && !selectedFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Cloud className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cloud Recognition</h3>
            <p className="text-gray-600">
              AI-powered cloud type identification with detailed explanations
            </p>
          </div>
          <div className="text-center">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Location Guessing</h3>
            <p className="text-gray-600">
              Analyze weather patterns and lighting to estimate photo locations
            </p>
          </div>
          <div className="text-center">
            <div className="h-12 w-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">B</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Blog Creation</h3>
            <p className="text-gray-600">
              Turn your cloud discoveries into shareable blog posts
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
