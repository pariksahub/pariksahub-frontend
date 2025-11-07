'use client';

import { useEffect } from 'react';

interface JsonLdSchemaProps {
  schema: object;
  id?: string;
}

export default function JsonLdSchema({ schema, id = 'json-ld-schema' }: JsonLdSchemaProps) {
  useEffect(() => {
    // Remove existing script if it exists
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Find where to insert - after analytics scripts, but ensure it's after meta tags
    const analyticsScript = document.getElementById('google-analytics-config');
    let insertPoint: Node | null = null;

    if (analyticsScript && analyticsScript.nextSibling) {
      // Insert after analytics scripts
      insertPoint = analyticsScript.nextSibling;
    } else if (analyticsScript) {
      // Analytics script exists but has no next sibling
      insertPoint = null; // Will append after analytics
    } else {
      // No analytics script, find first meta tag to insert after
      const charsetMeta = document.querySelector('meta[charset]');
      const firstMeta = document.querySelector('head > meta');
      const metaTag = charsetMeta || firstMeta;
      
      if (metaTag && metaTag.nextSibling) {
        insertPoint = metaTag.nextSibling;
      } else {
        insertPoint = null; // Will append after meta or to end
      }
    }

    // Create and insert script in head
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    
    if (insertPoint) {
      document.head.insertBefore(script, insertPoint);
    } else if (analyticsScript) {
      // Append after analytics script
      analyticsScript.insertAdjacentElement('afterend', script);
    } else {
      // Find meta tag and append after it, or append to head
      const charsetMeta = document.querySelector('meta[charset]');
      const firstMeta = document.querySelector('head > meta');
      const metaTag = charsetMeta || firstMeta;
      
      if (metaTag) {
        metaTag.insertAdjacentElement('afterend', script);
      } else {
        document.head.appendChild(script);
      }
    }

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [schema, id]);

  return null;
}

