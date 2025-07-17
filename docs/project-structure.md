# Project Structure Guide

This guide explains how the Cloutopia project is organized and how different pieces work together. This is designed for beginners to Next.js, so we'll start with the basics.

## 🗂️ High-Level Overview

Cloutopia is built using **Next.js 14 with App Router**, which is the modern way to build React applications. Think of it as having:

- **Pages**: Different screens users can visit (like Home, About, Login)
- **Components**: Reusable UI pieces (like Headers, Buttons, Forms)
- **Layouts**: Templates that wrap around pages (like navigation and footer)
- **Utilities**: Helper functions and configurations

## 📁 Directory Structure

Here's what each folder does:

```
cloutopia-website/
├── src/                          # All source code lives here
│   ├── app/                      # 🌐 Pages and routing (Next.js App Router)
│   ├── components/               # 🧩 Reusable UI components
│   ├── content/                  # 📄 Static content and data
│   └── lib/                      # 🛠️ Utilities and configurations
├── public/                       # 🖼️ Static files (images, icons)
├── docs/                         # 📖 Documentation
├── .env.local                    # 🔐 Environment variables (keep secret!)
├── package.json                  # 📦 Dependencies and scripts
└── README.md                     # 📝 Main project documentation
```

## 🌐 The `src/app/` Directory (Pages & Routing)

Next.js App Router uses **file-based routing**. This means the folder structure in `app/` automatically creates your website's URLs.

### Root Level Files

- **`layout.tsx`** - The main wrapper for ALL pages
  - Sets up fonts, metadata, and the `<html>` structure
  - Think of it as the "master template"

- **`page.tsx`** - The home page (`/`)
  - Currently redirects users to `/ai-chat`

- **`globals.css`** - Global styles that apply everywhere

### Page Directories

Each folder represents a different section of your website:

#### `/ai-chat/` - Main Cloud Recognition Interface
```
ai-chat/
├── page.tsx                      # Main chat page
└── components/                   # Chat-specific components
    ├── chat-interface.tsx        # The main chat UI
    ├── chat-input.tsx           # Message input area
    ├── chat-message.tsx         # Individual chat messages
    ├── chat-overview.tsx        # Welcome/intro screen
    └── cloud-character.tsx      # AI character avatar
```

#### `/auth/` - User Authentication
```
auth/
├── login/page.tsx               # Login page
├── sign-up/page.tsx             # Registration page
├── sign-up-success/page.tsx     # Post-registration success
├── forgot-password/page.tsx     # Password reset
├── update-password/page.tsx     # Change password
├── error/page.tsx               # Auth error handling
└── confirm/route.ts             # Email confirmation handler
```

#### `/blog/` - Blog System
```
blog/
├── page.tsx                     # Blog listing page
└── [id]/page.tsx               # Individual blog posts (dynamic route)
```

#### `/protected/` - User Dashboard
```
protected/
├── layout.tsx                   # Requires authentication
└── page.tsx                    # Dashboard content
```

#### Other Pages
- **`/about/page.tsx`** - About Cloutopia
- **`/contact/page.tsx`** - Contact form and info

## 🧩 The `src/components/` Directory

Components are reusable pieces of UI that you can use across multiple pages.

### Navigation Components
- **`Header.tsx`** - Main navigation bar with logo and menu
- **`Footer.tsx`** - Site footer with links and social media
- **`FloatingNav.tsx`** - Mobile-friendly floating navigation menu

### Authentication Components
- **`auth-button.tsx`** - Shows login/logout based on user state
- **`login-form.tsx`** - Login form with email/password
- **`sign-up-form.tsx`** - Registration form
- **`forgot-password-form.tsx`** - Password reset form
- **`update-password-form.tsx`** - Change password form
- **`logout-button.tsx`** - Simple logout button

### Utility Components
- **`ImageUpload.tsx`** - File upload with drag-and-drop functionality

## 📄 The `src/content/` Directory

This contains static data and content:

- **`articles.ts`** - Blog post data and content
  - Contains mock articles for the blog system
  - In a real app, this would come from a database

## 🛠️ The `src/lib/` Directory

Contains utility functions and configurations:

### `supabase/` - Database & Authentication
- **`client.ts`** - Supabase client for browser-side operations
- **`server.ts`** - Supabase client for server-side operations
- **`middleware.ts`** - Handles authentication state management

## 🖼️ The `public/` Directory

Static files that don't need processing:

```
public/
├── assets/                      # Brand assets
│   ├── cloutopia-logo4.png     # Main logo
│   └── cover.jpg               # Hero images
└── *.svg                       # Various icons
```

## 🔄 How Pages Work Together

### 1. **Layout Hierarchy**
```
Root Layout (layout.tsx)
├── Header (on most pages)
├── Page Content
└── Footer (on most pages)
```

### 2. **Authentication Flow**
```
User visits → Middleware checks auth → Protected pages require login
```

### 3. **Navigation Flow**
```
Header/FloatingNav → Route to different pages → Update active states
```

## 🚀 Key Concepts for Beginners

### File-Based Routing
- `app/about/page.tsx` → `/about` URL
- `app/blog/[id]/page.tsx` → `/blog/1`, `/blog/2`, etc.

### Server vs Client Components
- **Server Components** (default): Render on the server, faster, can access databases
- **Client Components** (`'use client'`): Run in browser, can use state and events

### Props and State
- **Props**: Data passed from parent to child components
- **State**: Data that can change (like form inputs, user login status)

### TypeScript Benefits
- Catches errors before they happen
- Better code completion in your editor
- Makes refactoring safer

## 🎯 Next Steps

1. **Start with a single component** - Try modifying `Header.tsx` to change the navigation
2. **Create a simple page** - Add a new folder in `app/` with a `page.tsx`
3. **Understand layouts** - See how `layout.tsx` wraps around pages
4. **Explore authentication** - Look at how `auth-button.tsx` changes based on user state

## 📚 Learning Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React TypeScript Guide](https://react.dev/learn/typescript)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase React Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
