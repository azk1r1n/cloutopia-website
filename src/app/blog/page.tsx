'use client'

import { useState, useEffect } from 'react'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../../components/Header'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: {
    name: string
    avatar?: string
  }
  date: string
  cover?: string
  tags: string[]
}

// Sample blog posts data (Alpine theme style)
const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'Get started with Cloutopia',
    content: `Creating cloud recognition insights with Cloutopia is as easy as uploading a photo, as well as sharing discoveries across platforms.

## Upload Your First Cloud Photo

Open the main interface and follow these steps:

1. Click the upload button or drag and drop your image
2. Wait for AI analysis
3. Explore the detailed cloud type identification
4. Ask questions about weather patterns and locations

## Understanding Cloud Types

Cloutopia can identify various cloud formations:
- **Cumulus**: Puffy, cotton-like clouds indicating fair weather
- **Stratus**: Layer clouds that often bring overcast conditions  
- **Cirrus**: High, wispy clouds that may signal weather changes
- **Cumulonimbus**: Towering clouds associated with thunderstorms

## Share Your Discoveries

Once you've analyzed your clouds:
- Save insights to your personal collection
- Generate shareable blog posts from conversations
- Contribute to the cloud recognition community

## Deploy Your Knowledge

You can apply cloud recognition skills to:
- Weather prediction and planning
- Photography and artistic projects
- Educational content creation
- Outdoor activity preparation

The AI becomes more accurate with diverse cloud photos and user interactions.`,
    excerpt: 'Creating cloud recognition insights with Cloutopia is as easy as uploading a photo, as well as sharing discoveries across platforms.',
    author: {
      name: 'Cloutopia Team'
    },
    date: '2024-08-22',
    cover: '/assets/cover.jpg',
    tags: ['get-started', 'tutorial', 'clouds']
  },
  {
    id: '2',
    title: 'Configure Your Cloud Analysis',
    content: `Learn how to configure Cloutopia with advanced settings for more detailed cloud analysis and weather insights.

## Analysis Settings

Customize your cloud recognition experience:
- **Confidence Levels**: Set minimum confidence thresholds
- **Detail Level**: Choose between quick or comprehensive analysis
- **Location Services**: Enable GPS for enhanced location guessing
- **Weather Integration**: Connect with weather APIs for context

## Advanced Features

Unlock powerful capabilities:
- **Multi-Image Analysis**: Compare multiple cloud photos
- **Time-lapse Recognition**: Track cloud formation changes
- **Weather Pattern Correlation**: Link clouds to weather data
- **Custom Training**: Teach the AI about local cloud types

## Privacy and Data

Your images and conversations are handled securely:
- Local processing when possible
- Encrypted data transmission
- Optional cloud backup
- User-controlled data retention

Configure these settings to match your needs and privacy preferences.`,
    excerpt: 'Learn how to configure Cloutopia with advanced settings for more detailed cloud analysis and weather insights.',
    author: {
      name: 'Technical Team'
    },
    date: '2024-08-22',
    tags: ['configuration', 'advanced', 'settings']
  },
  {
    id: '3',
    title: 'Write Cloud Articles',
    content: `Transform your cloud observations into engaging articles and stories using Cloutopia's built-in content creation tools.

## From Chat to Article

Converting conversations into articles is straightforward:
- Upload and analyze your cloud photos
- Have detailed conversations with the AI
- Use the "Generate Article" feature
- Edit and customize the content
- Publish to your blog or social media

## Storytelling Tips

Make your cloud stories compelling:
- **Start with Wonder**: Capture the moment you noticed the clouds
- **Add Scientific Context**: Include the AI's technical analysis
- **Share Personal Insights**: Add your own observations and feelings
- **Include Visual Evidence**: Feature your original photos prominently

## Content Formats

Cloutopia supports various content types:
- **Quick Observations**: Short posts about interesting cloud formations
- **Detailed Analysis**: In-depth articles about weather patterns
- **Photo Essays**: Visual stories with minimal text
- **Educational Content**: Teaching others about cloud types

## Publishing Options

Share your content across platforms:
- Internal blog system
- Export to external blogging platforms
- Social media integration
- PDF generation for offline sharing

Your cloud discoveries can inspire and educate others about the fascinating world above us.`,
    excerpt: 'Transform your cloud observations into engaging articles and stories using Cloutopia\'s built-in content creation tools.',
    author: {
      name: 'Content Creator'
    },
    date: '2024-08-22',
    tags: ['writing', 'content', 'storytelling']
  }
]

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading posts
    setTimeout(() => {
      setPosts(samplePosts)
      setLoading(false)
    }, 500)
  }, [])

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </button>

          {/* Article Header */}
          <header className="mb-8">
            {selectedPost.cover && (
              <div className="relative w-full h-64 md:h-96 mb-6 rounded-xl overflow-hidden">
                <Image
                  src={selectedPost.cover}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {selectedPost.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-600 mb-6">
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <span className="text-gray-600">{selectedPost.author.name}</span>
                <span>•</span>
                <span>{new Date(selectedPost.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {selectedPost.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              } else if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                )
              } else if (paragraph.startsWith('- ')) {
                const listItems = paragraph.split('\n').filter(item => item.startsWith('- '))
                return (
                  <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
                    {listItems.map((item, i) => (
                      <li key={i} className="text-gray-700">
                        <span dangerouslySetInnerHTML={{
                          __html: item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                      </li>
                    ))}
                  </ul>
                )
              } else if (paragraph.match(/^\d+\./)) {
                const listItems = paragraph.split('\n').filter(item => item.match(/^\d+\./))
                return (
                  <ol key={index} className="list-decimal pl-6 mb-4 space-y-2">
                    {listItems.map((item, i) => (
                      <li key={i} className="text-gray-700">
                        {item.replace(/^\d+\.\s/, '')}
                      </li>
                    ))}
                  </ol>
                )
              } else {
                return (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    <span dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                  </p>
                )
              }
            })}
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main Content - Alpine Theme Style */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Article */}
        {posts.length > 0 && (
          <div className="mb-16">
            <div 
              className="relative bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow group"
              onClick={() => setSelectedPost(posts[0])}
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2">
                  {posts[0].cover && (
                    <div className="relative h-64 lg:h-full">
                      <Image
                        src={posts[0].cover}
                        alt={posts[0].title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {posts[0].excerpt}
                  </p>
                  <div className="text-gray-500 text-sm">
                    {new Date(posts[0].date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(1).map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                {post.cover && (
                  <div className="relative h-48">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="text-gray-500 text-sm">
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cloutopia</h3>
            <nav className="flex justify-center space-x-8 mb-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/blog" className="text-blue-600 font-medium">Articles</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
            <p className="text-gray-500 text-sm">Follow me on</p>
            <div className="flex justify-center space-x-4 mt-4">
              {/* Add social media icons here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
