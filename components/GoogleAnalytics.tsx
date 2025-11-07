'use client';

import { useEffect } from 'react';

export default function GoogleAnalytics() {
  useEffect(() => {
    // Check if scripts already exist (to avoid duplicates)
    if (document.getElementById('google-analytics-script') || document.getElementById('google-analytics-config')) {
      return;
    }

    // Find the charset meta tag or first meta tag to insert after it
    const charsetMeta = document.querySelector('meta[charset]');
    const firstMeta = document.querySelector('head > meta');
    const insertAfter = charsetMeta || firstMeta;

    // Create and insert analytics script after meta tags
    const script1 = document.createElement('script');
    script1.id = 'google-analytics-script';
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-E717Z3TMN6';
    
    if (insertAfter && insertAfter.nextSibling) {
      // Insert after the meta tag
      document.head.insertBefore(script1, insertAfter.nextSibling);
    } else if (insertAfter) {
      // If meta tag exists but has no next sibling, append after it
      insertAfter.insertAdjacentElement('afterend', script1);
    } else {
      // Fallback: append to head if no meta tags found
      document.head.appendChild(script1);
    }

    // Create and insert config script right after script1
    const script2 = document.createElement('script');
    script2.id = 'google-analytics-config';
    script2.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-E717Z3TMN6', {
        send_page_view: false,
        page_path: window.location.pathname,
      });
    `;
    if (script1.nextSibling) {
      document.head.insertBefore(script2, script1.nextSibling);
    } else {
      script1.insertAdjacentElement('afterend', script2);
    }

    // Initialize gtag function globally
    (window as any).gtag = function(...args: any[]) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push(args);
    };
  }, []);

  return null;
}

