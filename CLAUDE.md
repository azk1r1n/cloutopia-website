# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cloutopia is a Next.js 14 cloud recognition application where users upload images of clouds/sky and chat with an LLM to identify cloud formations and guess photo locations based on atmospheric patterns.

**Tech Stack:**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS 4
- Supabase (Authentication & Database)
- React 19
- Lucide React (icons)

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Environment Setup

Required environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

See `.env.example` for additional optional variables for future Python backend integration.

## Architecture Overview

### Supabase Client Pattern

The application uses **three separate Supabase client instances** depending on the rendering context:

1. **Browser Client** (`src/lib/supabase/client.ts`): Used in Client Components
2. **Server Client** (`src/lib/supabase/server.ts`): Used in Server Components and Route Handlers
3. **Middleware Client** (`src/lib/supabase/middleware.ts`): Used in Next.js middleware for session management

**CRITICAL:** Always create a new Supabase client within each function when using it server-side. Do NOT put the server client in a global variable (important for Fluid compute compatibility).

### Authentication Flow

Authentication is handled through Supabase with Next.js middleware:

1. **Middleware** (`middleware.ts`): Intercepts all requests, checks session, redirects unauthenticated users attempting to access protected routes
2. **Protected Routes**: Pages under `/protected/` require authentication via layout component that checks user status
3. **Email Confirmation**: Sign-up flow requires email verification with redirect to `/auth/confirm`

**Current behavior:** Middleware redirects unauthenticated users to `/auth/login` if they try to access any route except `/`, `/login/*`, or `/auth/*`.

### State Management

- **Client-side state**: React hooks (useState, useEffect)
- **Chat state**: Managed locally in `chat-interface.tsx` (messages array, loading states)
- **Auth state**: Managed via Supabase session (checked in components and middleware)

**Note:** Chat messages are NOT persisted - they're ephemeral and reset on page refresh. This is intentional for the current implementation.

### File-Based Routing

Next.js App Router uses file structure for routing:

- `app/page.tsx` → `/` (redirects to `/ai-chat`)
- `app/ai-chat/page.tsx` → `/ai-chat`
- `app/blog/[id]/page.tsx` → `/blog/:id` (dynamic route)
- `app/protected/page.tsx` → `/protected` (requires auth)

**Layout Hierarchy:**
- Root layout (`app/layout.tsx`): Sets up fonts, metadata, global HTML structure
- Protected layout (`app/protected/layout.tsx`): Checks authentication before rendering children

## Key Components

### Chat System (`/app/ai-chat/components/`)

The chat interface is split into specialized components:

- **`chat-interface.tsx`**: Main container with message state, handles image uploads via drag-and-drop
- **`chat-input.tsx`**: Input field with image upload button and submit
- **`chat-message.tsx`**: Individual message rendering with markdown support
- **`chat-overview.tsx`**: Welcome screen shown when no messages exist
- **`cloud-character.tsx`**: Animated cloud character avatar

**Mock AI Responses:** Currently uses `generateCloudResponse()` function that returns randomized cloud analysis. This should be replaced with actual LLM API integration.

### Authentication Components (`/components/`)

- **`auth-button.tsx`**: Shows loading state → logged in user email + logout → login/signup buttons
- **`login-form.tsx`**: Email/password login with Supabase
- **`sign-up-form.tsx`**: Registration with password confirmation and email verification
- **`forgot-password-form.tsx`**: Password reset via email
- **`logout-button.tsx`**: Simple logout with router refresh

**Pattern:** All auth forms use client-side Supabase client, handle loading/error states, and redirect on success.

### Navigation Components

- **`Header.tsx`**: Desktop navigation with logo and auth state
- **`FloatingNav.tsx`**: Mobile-friendly floating navigation menu
- **`Footer.tsx`**: Site footer with links

## Component Patterns

### Server vs Client Components

- **Server Components** (default): Can access Supabase server client, fetch data, no interactive state
- **Client Components** (`'use client'` directive): Required for useState, useEffect, event handlers, browser APIs

**When to use each:**
- Authentication checks in layouts: Server Component with server Supabase client
- Forms with validation: Client Component with browser Supabase client
- Static pages: Server Component for better performance

### TypeScript Interface Patterns

Interfaces are defined locally in component files:

```typescript
// Message interface for chat system
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}
```

## Styling Guidelines

Uses Tailwind CSS 4 with light theme as default:

- Layout: `flex`, `grid`, responsive with `md:` and `lg:` prefixes
- Spacing: Consistent use of `gap-4`, `p-4`, `px-4 md:px-0`
- Colors: Light theme with `bg-gray-100`, `text-gray-900`, `border-gray-200`
- Dark mode: Some components have `dark:` variants but light is primary

**Responsive patterns:**
- Mobile-first design
- Desktop nav in Header, mobile nav in FloatingNav
- Max width containers: `max-w-[500px]` for chat, `max-w-7xl` for general content

## Content Management

Static content in `src/content/articles.ts`:

- Blog posts are stored as TypeScript objects with mock data
- Each article has id, title, author, date, excerpt, imageUrl, content
- Future: Should be migrated to Supabase database or CMS

## Future Integration Points

**Python Backend (currently not connected):**
- Environment variables prepared: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_UPLOAD_URL`
- Replace `generateCloudResponse()` with actual API calls to Python service
- Image upload should POST to backend for AI analysis

**Database Features to Add:**
- Chat history persistence (requires Supabase table)
- User profiles (user metadata in Supabase)
- Blog posts from database instead of static files

## Important Notes

1. **Server Component Async**: Server components using Supabase must be `async` and `await` the client creation
2. **Middleware Cookie Handling**: Never modify the supabaseResponse cookies in middleware - return as-is to prevent session issues
3. **Image Uploads**: Currently uses `URL.createObjectURL()` for preview only - images are not persisted
4. **Environment Variables**: `NEXT_PUBLIC_` prefix required for browser-accessible variables
5. **Session Updates**: Middleware automatically refreshes Supabase session on each request

## Common Debugging

**Authentication Issues:**
- Check Supabase environment variables are set
- Verify middleware is running (check Network tab for redirects)
- Check browser cookies for Supabase session tokens
- Ensure correct Supabase client is used (browser vs server)

**Routing Issues:**
- File name must be `page.tsx` for routes (not `index.tsx`)
- Dynamic routes use `[param]` folder naming
- Layout files apply to all children routes

**Build Errors:**
- TypeScript errors: Check component prop interfaces match
- Import errors: Verify `@/` alias points to `src/` directory (configured in `tsconfig.json`)
- Supabase client errors: Ensure async/await pattern for server components
