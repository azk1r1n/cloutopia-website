# Component Guide

This guide explains each React component in detail, what it does, and how to modify it. Perfect for Next.js beginners!

## 🧩 What Are Components?

Components are like **building blocks** for your website. Think of them as:
- **LEGO pieces** that you can combine to build bigger structures
- **Templates** that you can reuse across different pages
- **Functions** that return UI elements (buttons, forms, navigation bars)

## 🎨 Component Categories

### 🧭 Navigation Components

#### `Header.tsx` - Main Navigation Bar
**What it does:** The top navigation that appears on every page.

**Key features:**
- Logo and site title
- Navigation links (Home, About, Blog, Contact)
- User authentication buttons
- Responsive mobile menu
- Active link highlighting

**How to modify:**
```tsx
// To add a new navigation link, find this section:
<nav className="hidden md:flex items-center gap-8">
  <Link href="/" className={getLinkClasses('/')}>Home</Link>
  <Link href="/about" className={getLinkClasses('/about')}>About</Link>
  {/* Add your new link here */}
  <Link href="/features" className={getLinkClasses('/features')}>Features</Link>
</nav>
```

**Important concepts:**
- Uses `usePathname()` to know which page is active
- Responsive design: different layouts for mobile vs desktop
- State management with `useState` for mobile menu

#### `Footer.tsx` - Site Footer
**What it does:** Bottom section with links and social media.

**Key features:**
- Navigation links that match header
- Social media icons
- Active link highlighting
- Clean, minimalist design

#### `FloatingNav.tsx` - Mobile Navigation Menu
**What it does:** A floating button that opens a full-screen mobile menu.

**Key features:**
- Overlay-style navigation
- Smooth animations
- Touch-friendly design
- Current page indicator

### 🔐 Authentication Components

#### `auth-button.tsx` - Smart Authentication Button
**What it does:** Shows different buttons based on whether user is logged in.

**How it works:**
```tsx
// If user is logged in, shows:
<LogoutButton />

// If user is NOT logged in, shows:
<div>
  <Link href="/auth/login">Sign In</Link>
  <Link href="/auth/sign-up">Sign Up</Link>
</div>
```

**Key concepts:**
- Uses `useEffect` to check authentication state
- Connects to Supabase for user data
- Handles loading states gracefully

#### `login-form.tsx` - User Login Form
**What it does:** Handles user sign-in with email and password.

**Key features:**
- Form validation
- Error handling and display
- Loading states during submission
- Redirects to dashboard after login

**How it works:**
```tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault(); // Prevent page refresh
  
  // Call Supabase to authenticate
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    setError(error.message); // Show error to user
  } else {
    router.push("/protected"); // Redirect on success
  }
};
```

#### `sign-up-form.tsx` - User Registration Form
**What it does:** Creates new user accounts.

**Key features:**
- Password confirmation validation
- Email verification flow
- Form state management
- Success page redirection

#### `forgot-password-form.tsx` - Password Reset
**What it does:** Sends password reset emails.

#### `update-password-form.tsx` - Change Password
**What it does:** Allows users to set new passwords.

#### `logout-button.tsx` - Simple Logout
**What it does:** Signs users out and refreshes the page.

### 📁 Utility Components

#### `ImageUpload.tsx` - File Upload Component
**What it does:** Handles image uploads with drag-and-drop.

**Key features:**
- Drag and drop functionality
- File type validation
- Image preview
- Upload progress indicators

## 🔄 How Components Communicate

### Parent to Child: Props
```tsx
// Parent component passes data to child
<LoginForm redirectUrl="/dashboard" />

// Child component receives data
function LoginForm({ redirectUrl }: { redirectUrl: string }) {
  // Use redirectUrl here
}
```

### Child to Parent: Callback Functions
```tsx
// Parent defines what happens when child triggers action
<ImageUpload onUpload={(file) => handleFileUpload(file)} />

// Child calls the function when something happens
function ImageUpload({ onUpload }) {
  const handleDrop = (files) => {
    onUpload(files[0]); // Send data back to parent
  };
}
```

### Between Components: Global State
- **Authentication state**: Managed by Supabase
- **Navigation state**: Handled by Next.js router
- **Form state**: Local to each component

## 🎨 Styling with Tailwind CSS

All components use **Tailwind CSS** for styling. Here's what the class names mean:

### Common Patterns
```tsx
// Flexbox layouts
className="flex items-center justify-between"

// Responsive design
className="hidden md:flex" // Hidden on mobile, flex on desktop

// Colors and states
className="text-gray-600 hover:text-gray-900"

// Spacing
className="p-4 mb-6 gap-3" // padding, margin-bottom, gap
```

### Button Styles
```tsx
// Primary button
className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

// Secondary button
className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
```

## 🔧 Making Your First Component

Let's create a simple "Welcome Message" component:

1. **Create the file:** `src/components/WelcomeMessage.tsx`

```tsx
// Import necessary items
import { User } from '@supabase/supabase-js';

// Define props (data coming into component)
interface WelcomeMessageProps {
  user: User | null;
  showTime?: boolean; // Optional prop
}

// Create the component
export default function WelcomeMessage({ user, showTime = true }: WelcomeMessageProps) {
  const currentTime = new Date().toLocaleTimeString();
  
  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h2 className="text-xl font-bold text-blue-900">
        Welcome{user ? `, ${user.email}` : ' to Cloutopia'}!
      </h2>
      
      {showTime && (
        <p className="text-blue-700 text-sm">
          Current time: {currentTime}
        </p>
      )}
    </div>
  );
}
```

2. **Use it in a page:**

```tsx
// In any page component
import WelcomeMessage from '@/components/WelcomeMessage';

export default function SomePage() {
  return (
    <div>
      <WelcomeMessage user={currentUser} showTime={true} />
    </div>
  );
}
```

## 🚀 Component Best Practices

### 1. Keep Components Small and Focused
- One component should do one thing well
- If it's getting too complex, break it into smaller components

### 2. Use TypeScript Interfaces
```tsx
interface ComponentProps {
  title: string;
  isVisible?: boolean; // Optional with ?
  onClick: () => void; // Function prop
}
```

### 3. Handle Loading and Error States
```tsx
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
return <div>Your content here</div>;
```

### 4. Use Consistent Naming
- Component files: `PascalCase.tsx`
- Props: `camelCase`
- CSS classes: `kebab-case` (handled by Tailwind)

## 🎯 Next Steps for Learning

1. **Pick one component** and try to understand every line
2. **Modify an existing component** (like changing button colors in Header)
3. **Create a simple component** following the example above
4. **Add it to a page** and see it work
5. **Learn about state** (`useState`) and effects (`useEffect`)

## 📚 Additional Resources

- [React Components Guide](https://react.dev/learn/your-first-component)
- [TypeScript with React](https://react.dev/learn/typescript)
- [Tailwind CSS Classes](https://tailwindcss.com/docs/utility-first)
- [Next.js Components](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
