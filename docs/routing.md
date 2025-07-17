# Routing Guide

This guide explains how navigation and routing work in Cloutopia using Next.js App Router. Perfect for beginners!

## 🛤️ What Is Routing?

Routing is how your website decides **what to show when someone visits a URL**. Think of it like:

- A **map** that connects URLs to pages
- A **directory** where each folder represents a different section
- A **filing system** where files are organized by topic

## 📁 File-Based Routing in Next.js

Next.js uses **file-based routing**, which means:
- The folder structure in `src/app/` automatically creates your website's URLs
- No need to manually configure routes
- Very intuitive once you understand the pattern

### Basic Pattern
```
src/app/about/page.tsx  →  website.com/about
src/app/blog/page.tsx   →  website.com/blog
src/app/contact/page.tsx →  website.com/contact
```

## 🗺️ Cloutopia's Route Map

Here's every route in the application and what it does:

### Public Routes (No Login Required)
```
/                           # Home page (redirects to /ai-chat)
/ai-chat                    # Main cloud recognition interface
/about                      # About Cloutopia and how it works
/blog                       # List of all blog articles
/blog/[id]                  # Individual blog post (dynamic route)
/contact                    # Contact form and information
```

### Authentication Routes
```
/auth/login                 # User login page
/auth/sign-up               # User registration page
/auth/sign-up-success       # Success message after registration
/auth/forgot-password       # Password reset request
/auth/update-password       # Set new password
/auth/error                 # Authentication error messages
/auth/confirm               # Email confirmation handler
```

### Protected Routes (Login Required)
```
/protected                  # User dashboard and account management
```

## 📂 Route File Structure

Let's look at how each route is organized:

### Simple Routes
For basic pages, you just need a `page.tsx` file:

```
src/app/
├── page.tsx                # Home page (/)
├── about/
│   └── page.tsx           # About page (/about)
├── contact/
│   └── page.tsx           # Contact page (/contact)
└── blog/
    └── page.tsx           # Blog listing (/blog)
```

### Dynamic Routes
For pages that change based on URL parameters:

```
src/app/blog/
├── page.tsx               # Blog listing (/blog)
└── [id]/                  # Dynamic segment
    └── page.tsx           # Individual post (/blog/1, /blog/2, etc.)
```

**How dynamic routes work:**
```tsx
// In /blog/[id]/page.tsx
export default function ArticlePage() {
  const params = useParams();
  const id = params.id; // Gets "1" from URL "/blog/1"
  
  // Use the id to fetch the specific article
  const article = getArticleById(parseInt(id));
  
  return <div>{article.title}</div>;
}
```

### Route Groups
Organize related routes without affecting the URL:

```
src/app/auth/
├── login/page.tsx         # /auth/login
├── sign-up/page.tsx       # /auth/sign-up
├── error/page.tsx         # /auth/error
└── confirm/route.ts       # /auth/confirm (API route)
```

## 🔧 Special Files in App Router

### `page.tsx` - The Page Component
Creates a publicly accessible route:

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Cloutopia</h1>
      <p>We help you identify clouds!</p>
    </div>
  );
}
```

### `layout.tsx` - Shared UI Layouts
Wraps pages with common elements:

```tsx
// src/app/layout.tsx (Root layout - wraps ALL pages)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children} {/* This is where each page renders */}
      </body>
    </html>
  );
}

// src/app/protected/layout.tsx (Protected layout - only for /protected/* pages)
export default function ProtectedLayout({ children }) {
  // Check if user is logged in
  const user = await getUser();
  if (!user) redirect('/auth/login');
  
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

### `route.ts` - API Routes
Handle server-side logic:

```tsx
// src/app/auth/confirm/route.ts
export async function GET(request: Request) {
  // Handle email confirmation
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  // Verify token with Supabase
  // Redirect user appropriately
}
```

### `not-found.tsx` - 404 Pages
Custom error pages:

```tsx
// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}
```

## 🧭 Navigation Between Pages

### Using the `Link` Component
The standard way to navigate in Next.js:

```tsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

**Why use `Link` instead of `<a>`?**
- Faster navigation (no page refresh)
- Preloads pages for better performance
- Maintains client-side state

### Programmatic Navigation
Navigate using JavaScript:

```tsx
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  
  const handleLogin = async () => {
    // Login logic here...
    
    // Redirect after successful login
    router.push('/protected');
  };
  
  return <form onSubmit={handleLogin}>...</form>;
}
```

### Common Navigation Patterns

**Conditional Navigation:**
```tsx
// Redirect based on user state
if (user) {
  router.push('/protected');
} else {
  router.push('/auth/login');
}
```

**Navigation with Data:**
```tsx
// Pass data through URL parameters
router.push(`/blog/${article.id}`);

// Pass data through search params
router.push('/search?query=clouds&type=cumulus');
```

## 🎯 Active Link Highlighting

Show users which page they're currently on:

```tsx
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    return pathname === href;
  };
  
  return (
    <nav>
      <Link 
        href="/about" 
        className={isActive('/about') ? 'text-blue-600' : 'text-gray-600'}
      >
        About
      </Link>
    </nav>
  );
}
```

## 🔒 Protected Routes

Some pages should only be accessible to logged-in users:

### Layout-Based Protection
```tsx
// src/app/protected/layout.tsx
export default async function ProtectedLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login");
  }
  
  // If authenticated, show the page
  return <>{children}</>;
}
```

### Middleware-Based Protection
```tsx
// middleware.ts (root level)
export async function middleware(request: NextRequest) {
  // Check authentication for protected routes
  if (request.nextUrl.pathname.startsWith('/protected')) {
    const token = request.cookies.get('token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
}
```

## 🔄 Route Loading States

Show loading UI while navigating:

```tsx
// Using React Suspense
export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
      <Footer />
    </div>
  );
}
```

## 📱 Mobile Navigation

Handle navigation on mobile devices:

```tsx
// Mobile-friendly navigation with hamburger menu
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>
      
      {isOpen && (
        <nav className="mobile-menu">
          <Link href="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>
            About
          </Link>
        </nav>
      )}
    </div>
  );
}
```

## 🐛 Common Routing Issues

### Page Not Loading
**Problem:** New page shows 404 error
**Solution:** Make sure you have a `page.tsx` file in the correct folder

### Layout Not Applied
**Problem:** Layout doesn't wrap the page
**Solution:** Check that `layout.tsx` is in the correct directory

### Dynamic Route Not Working
**Problem:** `/blog/1` shows 404
**Solution:** Make sure folder is named `[id]` with square brackets

### Navigation Doesn't Work
**Problem:** Links don't navigate
**Solution:** Use `Link` from `next/link`, not regular `<a>` tags

## 🚀 Advanced Routing Concepts

### Parallel Routes
Show multiple pages at the same time:
```
src/app/dashboard/
├── page.tsx
├── @analytics/page.tsx
└── @notifications/page.tsx
```

### Intercepting Routes
Show modals or overlays:
```
src/app/
├── feed/page.tsx
└── (..)photo/[id]/page.tsx  # Intercepts /photo/[id]
```

### Route Handlers
Create API endpoints:
```tsx
// src/app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Create user logic
  return Response.json({ success: true });
}
```

## 📚 Learning Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app/building-your-application/routing)
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Layouts and Templates](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
