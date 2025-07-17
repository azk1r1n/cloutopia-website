# Getting Started Guide

This guide will help you understand and start developing with Cloutopia. Perfect for developers new to Next.js!

## 🎯 What You'll Learn

By the end of this guide, you'll understand:
- How to set up the development environment
- How the project is organized
- How to make your first changes
- How to add new features
- How to deploy your changes

## 🛠️ Prerequisites

Before starting, make sure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **Git** configured ([Setup guide](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup))
- A **code editor** (VS Code recommended)
- A **Supabase account** (free tier available at [supabase.com](https://supabase.com))

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd cloutopia-website

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local
```

### 2. Configure Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. Update `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development

```bash
# Start the development server
npm run dev

# Open your browser to http://localhost:3000
```

## 🎮 Making Your First Change

Let's start with something simple - changing the site title:

### Step 1: Find the Header Component
Open `src/components/Header.tsx` and find this line:
```tsx
<h1 className="text-2xl font-semibold text-gray-900">Cloutopia</h1>
```

### Step 2: Change the Title
Change "Cloutopia" to anything you want:
```tsx
<h1 className="text-2xl font-semibold text-gray-900">My Cloud App</h1>
```

### Step 3: See Your Changes
Save the file and check your browser - the title should update automatically!

## 📁 Understanding the Project Structure

### Core Directories

**`src/app/`** - Your website pages
- Each folder becomes a URL route
- `page.tsx` files create the actual pages
- `layout.tsx` files wrap pages with common elements

**`src/components/`** - Reusable UI pieces
- Header, Footer, Forms, Buttons, etc.
- Can be used across multiple pages

**`src/lib/`** - Utilities and configurations
- Supabase setup
- Helper functions
- Type definitions

**`public/`** - Static files
- Images, icons, logos
- Files here can be accessed directly via URL

### Key Files

- **`package.json`** - Project dependencies and scripts
- **`.env.local`** - Environment variables (keep secret!)
- **`tailwind.config.js`** - Styling configuration
- **`tsconfig.json`** - TypeScript configuration

## 🧩 Adding Your First Component

Let's create a simple "Welcome" component:

### Step 1: Create the Component File
Create `src/components/Welcome.tsx`:

```tsx
interface WelcomeProps {
  name?: string;
}

export default function Welcome({ name = "User" }: WelcomeProps) {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-2">
        Welcome, {name}! 👋
      </h2>
      <p className="text-blue-100">
        Ready to analyze some clouds?
      </p>
    </div>
  );
}
```

### Step 2: Use It in a Page
Add it to the home page in `src/app/page.tsx`:

```tsx
import Welcome from '@/components/Welcome';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <Welcome name="Cloud Explorer" />
      {/* Rest of your page content */}
    </div>
  );
}
```

## 🛣️ Adding a New Page

Let's create a "Features" page:

### Step 1: Create the Page Directory
```bash
mkdir src/app/features
```

### Step 2: Create the Page Component
Create `src/app/features/page.tsx`:

```tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FeaturesPage() {
  const features = [
    {
      title: "Cloud Recognition",
      description: "Identify different cloud types instantly",
      icon: "☁️"
    },
    {
      title: "Location Analysis", 
      description: "Estimate where photos were taken",
      icon: "🌍"
    },
    {
      title: "Weather Insights",
      description: "Learn about atmospheric conditions",
      icon: "⛈️"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Cloutopia Features
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
```

### Step 3: Add Navigation
Update the Header component to include a link to your new page:

```tsx
// In src/components/Header.tsx, find the navigation section and add:
<Link href="/features" className={getLinkClasses('/features')}>
  Features
</Link>
```

## 🎨 Styling with Tailwind CSS

Tailwind uses utility classes for styling. Here are common patterns:

### Layout Classes
```tsx
// Flexbox
className="flex items-center justify-between"

// Grid
className="grid grid-cols-1 md:grid-cols-3 gap-4"

// Spacing
className="p-4 m-2 mb-6" // padding, margin, margin-bottom
```

### Colors and Typography
```tsx
// Text colors
className="text-gray-600 text-blue-500 text-white"

// Background colors
className="bg-white bg-blue-500 bg-gradient-to-r from-blue-500 to-purple-600"

// Text sizes
className="text-sm text-lg text-2xl text-4xl"

// Font weights
className="font-normal font-medium font-semibold font-bold"
```

### Interactive States
```tsx
// Hover effects
className="hover:bg-blue-600 hover:text-white"

// Focus states
className="focus:ring-2 focus:ring-blue-500"

// Transitions
className="transition-colors duration-200"
```

## 🔐 Working with Authentication

### Check if User is Logged In
```tsx
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    getUser();
  }, []);

  if (user) {
    return <div>Welcome, {user.email}!</div>;
  }

  return <div>Please log in</div>;
}
```

### Create a Protected Component
```tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedComponent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Only logged-in users can see this!</p>
    </div>
  );
}
```

## 📝 Working with Forms

### Basic Form Example
```tsx
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle form submission
    console.log('Form data:', formData);
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>
      
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}
```

## 🧪 Testing Your Changes

### Check Your Code
```bash
# Check for TypeScript errors
npm run build

# Check for linting issues
npm run lint
```

### Preview Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Add Environment Variables**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add your Supabase URL and anon key

3. **Deploy**
   - Every push to main branch will automatically deploy

### Environment Variables for Production
```bash
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

## 🐛 Common Issues and Solutions

### Issue: "Module not found"
**Solution:** Check your import paths and make sure files exist

### Issue: "Hydration error"
**Solution:** Make sure server and client render the same content initially

### Issue: Styles not applying
**Solution:** Check Tailwind class names and make sure they're included in your build

### Issue: Authentication not working
**Solution:** Verify environment variables and Supabase configuration

## 🎯 Next Steps

Now that you understand the basics:

1. **Explore existing components** - Look at how they're built
2. **Add a new feature** - Try building something from scratch
3. **Customize the design** - Change colors, layouts, and styles
4. **Add more pages** - Expand the site with new functionality
5. **Integrate APIs** - Connect to external services

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Guides](https://supabase.com/docs)

## 💡 Tips for Success

1. **Start small** - Make tiny changes and see how they work
2. **Use the browser inspector** - Learn to debug with dev tools
3. **Read error messages carefully** - They usually tell you exactly what's wrong
4. **Ask for help** - Use GitHub issues or community forums
5. **Practice regularly** - Build small projects to reinforce learning

Happy coding! 🚀
