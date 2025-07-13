'use client';

import { Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === '/about' && pathname === '/about') return true;
    if (href === '/blog' && pathname.startsWith('/blog')) return true;
    if (href === '/contact' && pathname === '/contact') return true;
    return false;
  };

  return (
    <footer className="flex flex-col items-center py-8 mt-24 border-t border-gray-200 dark:border-gray-700">
      <div className="mb-8">
        <nav className="flex justify-center space-x-8 text-base font-medium">
          <Link 
            href="/about" 
            className={isActiveLink('/about') 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            }
          >
            About
          </Link>
          <Link 
            href="/blog" 
            className={isActiveLink('/blog') 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            }
          >
            Articles
          </Link>
          <Link 
            href="/contact" 
            className={isActiveLink('/contact') 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            }
          >
            Contact
          </Link>
        </nav>
      </div>
      
      <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
        Follow me on
      </p>
      
      <div className="flex justify-center space-x-4">
        <a 
          href="https://twitter.com/cloutopia" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-label="Twitter"
        >
          <Twitter className="w-5 h-5" />
        </a>
        <a 
          href="https://instagram.com/cloutopia" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <a 
          href="https://linkedin.com/company/cloutopia" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
}
