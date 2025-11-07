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
    const headElement = document.head;

    // Create and insert script in head
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    
    if (analyticsScript && analyticsScript.parentNode === headElement) {
      analyticsScript.insertAdjacentElement('afterend', script);
    } else {
      const charsetMeta = document.querySelector('meta[charset]');
      const firstMeta = document.querySelector('head > meta');
      const metaTag = charsetMeta || firstMeta;

      if (metaTag && metaTag.parentNode === headElement) {
        metaTag.insertAdjacentElement('afterend', script);
      } else {
        headElement.appendChild(script);
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

