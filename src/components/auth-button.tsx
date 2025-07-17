"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { LogoutButton } from "./logout-button";
import type { User } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase environment variables not configured");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      // Get initial session
      supabase.auth.getUser()
        .then(({ data: { user }, error }) => {
          if (error) {
            console.error("Auth error:", error);
            setError(error.message);
          } else {
            setUser(user);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Auth initialization error:", err);
          setError("Failed to initialize authentication");
          setLoading(false);
        });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setError(null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch (err) {
      console.error("Supabase client error:", err);
      setError("Failed to create Supabase client");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="w-24 h-8 bg-gray-200 animate-pulse rounded" />;
  }

  // If there's an error (likely missing env vars), show sign up/in buttons without auth functionality
  if (error) {
    console.warn("Auth error:", error);
    return (
      <div className="flex gap-2">
        <Link 
          href="/auth/login"
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Sign In
        </Link>
        <Link 
          href="/auth/sign-up"
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Hey, {user.email}!
      </span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Link 
        href="/auth/login"
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        Sign In
      </Link>
      <Link 
        href="/auth/sign-up"
        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
