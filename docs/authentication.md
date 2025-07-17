# Authentication Guide

This guide explains how user authentication works in Cloutopia, using Supabase as our backend service. Perfect for beginners!

## 🔐 What Is Authentication?

Authentication is the process of **verifying who someone is**. In web apps, this typically means:

- **Sign Up**: Creating a new account
- **Sign In**: Logging into an existing account  
- **Sign Out**: Ending the session
- **Password Reset**: Recovering forgotten passwords
- **Session Management**: Keeping users logged in across page visits

## 🏗️ How Cloutopia Handles Authentication

### The Stack
- **Supabase**: Handles user accounts, passwords, and sessions
- **Next.js Middleware**: Protects pages that require login
- **React Components**: Provide the user interface
- **TypeScript**: Ensures type safety

### The Flow
```
User Action → React Component → Supabase → Database → Response → UI Update
```

## 🗂️ Authentication Files Overview

### Configuration Files
```
src/lib/supabase/
├── client.ts           # Browser-side Supabase client
├── server.ts           # Server-side Supabase client  
└── middleware.ts       # Session management
```

### Components
```
src/components/
├── auth-button.tsx           # Shows login/logout based on state
├── login-form.tsx           # Email/password login form
├── sign-up-form.tsx         # Registration form
├── forgot-password-form.tsx # Password reset form
├── update-password-form.tsx # Change password form
└── logout-button.tsx        # Simple logout button
```

### Pages
```
src/app/auth/
├── login/page.tsx           # Login page
├── sign-up/page.tsx         # Registration page
├── forgot-password/page.tsx # Password reset page
├── update-password/page.tsx # Change password page
├── sign-up-success/page.tsx # Post-registration success
└── error/page.tsx           # Authentication errors
```

### Protected Pages
```
src/app/protected/
├── layout.tsx              # Requires authentication
└── page.tsx               # User dashboard
```

## 🔄 Step-by-Step Authentication Flow

### 1. User Registration (Sign Up)

**What happens:**
1. User fills out the registration form
2. Form validates password confirmation
3. Supabase creates the account
4. Supabase sends confirmation email
5. User clicks email link to verify account

**Code walkthrough:**
```tsx
// In sign-up-form.tsx
const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate passwords match
  if (password !== repeatPassword) {
    setError("Passwords do not match");
    return;
  }

  // Create account with Supabase
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  });

  if (error) {
    setError(error.message);
  } else {
    router.push("/auth/sign-up-success"); // Show success page
  }
};
```

### 2. User Login (Sign In)

**What happens:**
1. User enters email and password
2. Supabase verifies credentials
3. If valid, creates a session
4. User is redirected to dashboard

**Code walkthrough:**
```tsx
// In login-form.tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  // Authenticate with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setError(error.message); // Show error to user
  } else {
    router.push("/protected"); // Redirect to dashboard
  }
};
```

### 3. Session Management

**How sessions work:**
- When users log in, Supabase creates a **session token**
- This token is stored in the browser
- Every page load checks if the token is valid
- If valid, user stays logged in
- If expired, user is redirected to login

**Middleware protection:**
```tsx
// In src/lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
  // Get current session from Supabase
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // If no user and trying to access protected page, redirect to login
  if (!user && request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Continue to requested page
  return response;
}
```

### 4. Password Reset

**What happens:**
1. User enters email on forgot password page
2. Supabase sends reset email with special link
3. User clicks link, gets redirected to update password page
4. User enters new password
5. Password is updated in database

### 5. Logout

**What happens:**
1. User clicks logout button
2. Supabase clears the session
3. Page refreshes to update UI
4. User is now logged out

```tsx
// In logout-button.tsx
const handleLogout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut(); // Clear session
  router.refresh(); // Refresh page to update UI
};
```

## 🛡️ Protected Routes

Some pages require users to be logged in. This is handled by a **layout component**:

```tsx
// In src/app/protected/layout.tsx
export default async function ProtectedLayout({ children }) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  // If no user, redirect to login page
  if (!user) {
    redirect("/auth/login");
  }

  // If authenticated, show the page
  return <>{children}</>;
}
```

**How it works:**
- Any page inside `/protected/` folder requires login
- The layout checks authentication before showing content
- If not logged in, automatically redirects to login page

## 🔧 Environment Variables

Authentication requires these environment variables:

```bash
# In .env.local file
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Why two variables?**
- **URL**: Points to your specific Supabase project
- **Anon Key**: Allows public access to authentication features
- Both are safe to expose in the browser (hence `NEXT_PUBLIC_`)

## 🎨 UI State Management

The `auth-button.tsx` component shows different UI based on user state:

```tsx
// Shows loading spinner while checking auth state
if (loading) {
  return <div className="w-24 h-8 bg-gray-200 animate-pulse rounded" />;
}

// If user is logged in, show logout button
if (user) {
  return (
    <div className="flex items-center gap-4">
      <span>Hey, {user.email}!</span>
      <LogoutButton />
    </div>
  );
}

// If user is NOT logged in, show login/signup buttons
return (
  <div className="flex gap-2">
    <Link href="/auth/login">Sign In</Link>
    <Link href="/auth/sign-up">Sign Up</Link>
  </div>
);
```

## 🔍 Debugging Authentication Issues

### Common Problems and Solutions

**1. "User not authenticated" errors**
- Check if environment variables are set correctly
- Verify Supabase project URL and keys
- Check browser network tab for failed requests

**2. Redirects not working**
- Ensure middleware is configured properly
- Check if `/protected/layout.tsx` is working
- Verify redirect URLs in Supabase dashboard

**3. Email confirmation not working**
- Check spam folder
- Verify email templates in Supabase
- Ensure redirect URLs match your domain

**4. Session not persisting**
- Check if cookies are enabled
- Verify Supabase client configuration
- Check for JavaScript errors in console

### Useful Debugging Tools

```tsx
// Add this to any component to see current auth state
useEffect(() => {
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session);
    console.log('Current user:', session?.user);
  };
  checkUser();
}, []);
```

## 🚀 Extending Authentication

### Adding New Auth Features

**Social Login (Google, GitHub, etc.):**
```tsx
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
};
```

**User Profiles:**
```tsx
// Get user profile data
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
```

**Role-Based Access:**
```tsx
// Check user role before showing admin features
if (user?.user_metadata?.role === 'admin') {
  return <AdminPanel />;
}
```

## 📚 Learning Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- [React Hook Form](https://react-hook-form.com/) - For better form handling
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) - Advanced patterns
