'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ContentBlock {
  type: 'code' | 'text';
  code?: string;
  language?: string;
  text_content?: string;
  order?: number;
  label?: string;
}

interface Question {
  _id?: string;
  title: string;
  description?: string;
  difficulty?: string;
  content_blocks?: ContentBlock[];
  order?: number;
}

interface QuestionClientProps {
  questions: Question[];
}

// Function to detect language from code content
function detectLanguage(code: string, providedLanguage?: string): string {
  if (providedLanguage) {
    return providedLanguage.toLowerCase();
  }
  
  const codeLower = code.toLowerCase().trim();
  
  // Python indicators
  if (codeLower.includes('def ') || codeLower.includes('import ') || 
      codeLower.includes('print(') || codeLower.includes('if __name__') ||
      codeLower.includes('lambda ') || codeLower.includes('yield ')) {
    return 'python';
  }
  
  // JavaScript indicators
  if (codeLower.includes('function ') || codeLower.includes('const ') || 
      codeLower.includes('let ') || codeLower.includes('console.log') ||
      codeLower.includes('=>') || codeLower.includes('require(')) {
    return 'javascript';
  }
  
  // Java indicators
  if (codeLower.includes('public class') || codeLower.includes('public static void') ||
      codeLower.includes('system.out.println')) {
    return 'java';
  }
  
  // C/C++ indicators
  if (codeLower.includes('#include') || codeLower.includes('int main') ||
      codeLower.includes('printf') || codeLower.includes('std::')) {
    return 'cpp';
  }
  
  // HTML indicators
  if (codeLower.includes('<html') || codeLower.includes('<!doctype') ||
      codeLower.includes('<div') || codeLower.includes('<p>')) {
    return 'html';
  }
  
  // CSS indicators
  if (codeLower.includes('{') && codeLower.includes(':') && 
      (codeLower.includes('color') || codeLower.includes('margin') || codeLower.includes('padding'))) {
    return 'css';
  }
  
  // Default to text if can't detect
  return 'text';
}

// Function to parse HTML and replace code blocks with syntax-highlighted versions
function parseDescriptionWithSyntaxHighlighting(html: string): React.ReactNode[] {
  // Return empty array if no HTML
  if (!html || typeof html !== 'string') {
    return [];
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;
  
  // Regex to match <pre><code>...</code></pre> blocks
  const codeBlockRegex = /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g;
  let match;
  
  while ((match = codeBlockRegex.exec(html)) !== null) {
    // Add content before the code block
    if (match.index > lastIndex) {
      const beforeHtml = html.substring(lastIndex, match.index);
      // Only add if there's actual content (not just whitespace)
      if (beforeHtml.trim()) {
        parts.push(
          <div 
            key={`html-${matchIndex}-${lastIndex}`}
            className="prose-custom text-white/80"
            dangerouslySetInnerHTML={{ __html: beforeHtml }}
            suppressHydrationWarning
          />
        );
      }
    }
    
    // Extract and clean the code
    let code = match[1];
    // Decode HTML entities
    code = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    
    // Detect language - ensure consistent detection
    const language = detectLanguage(code);
    
    // Add syntax-highlighted code block
    parts.push(
      <div key={`code-${matchIndex}-${match.index}`} className="my-4">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            borderRadius: '0.5rem',
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            margin: '0.75rem 0',
            backgroundColor: '#1e1e1e',
          }}
          PreTag="div"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
    
    lastIndex = match.index + match[0].length;
    matchIndex++;
  }
  
  // Add remaining content after the last code block
  if (lastIndex < html.length) {
    const afterHtml = html.substring(lastIndex);
    // Only add if there's actual content
    if (afterHtml.trim()) {
      parts.push(
        <div 
          key={`html-${matchIndex}-${lastIndex}`}
          className="prose-custom text-white/80"
          dangerouslySetInnerHTML={{ __html: afterHtml }}
          suppressHydrationWarning
        />
      );
    }
  }
  
  // If no code blocks found, return original HTML
  if (parts.length === 0 && html.trim()) {
    return [
      <div 
        key="html-full"
        className="prose-custom text-white/80"
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
    ];
  }
  
  return parts;
}

export default function QuestionClient({ questions }: QuestionClientProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component only renders after hydration to avoid mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const copyCode = (code: string, id: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="space-y-8" role="list" aria-label="Programming questions with code examples">
        {questions.map((question, index) => (
          <article
            key={question._id || `question-${index}`}
            className="bg-[#161B33] rounded-xl border border-gray-800 p-6 sm:p-8"
          >
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8" role="list" aria-label="Programming questions with code examples">
      <style dangerouslySetInnerHTML={{
        __html: `
          .prose-custom p {
            margin-bottom: 0.75rem;
            line-height: 1.6;
          }
          
          .prose-custom ul {
            list-style-type: disc !important;
            margin: 0.75rem 0 !important;
            padding-left: 1.5rem !important;
          }
          
          .prose-custom ol {
            list-style-type: decimal !important;
            margin: 0.75rem 0 !important;
            padding-left: 1.5rem !important;
          }
          
          .prose-custom li {
            margin-bottom: 0.25rem !important;
            line-height: 1.6 !important;
            display: list-item !important;
          }
          
          .prose-custom strong {
            font-weight: 600;
            color: #ffffff;
          }
          
          .prose-custom em {
            font-style: italic;
          }
          
          .prose-custom u {
            text-decoration: underline;
          }
          
          .prose-custom a {
            color: #6366F1;
            text-decoration: underline;
          }
          
          .prose-custom a:hover {
            color: #8B5CF6;
          }
          
          .prose-custom h1,
          .prose-custom h2,
          .prose-custom h3 {
            font-weight: 700;
            color: #ffffff;
            margin: 1rem 0 0.5rem 0;
          }
          
          .prose-custom p {
            color: rgba(255, 255, 255, 0.8);
          }
          
          .prose-custom li {
            color: rgba(255, 255, 255, 0.8);
          }
          
          .prose-custom img {
            max-width: 100% !important;
            max-height: 500px !important;
            width: auto !important;
            height: auto !important;
            display: block !important;
            margin: 1rem auto !important;
            border-radius: 0.5rem;
            object-fit: contain;
          }
          
          .prose-custom img[style*="width"],
          .prose-custom img[style*="Width"] {
            max-width: 100% !important;
            width: auto !important;
          }
          
          .prose-custom img[style*="height"],
          .prose-custom img[style*="Height"] {
            max-height: 500px !important;
            height: auto !important;
          }
          
          @media (min-width: 640px) {
            .prose-custom img {
              max-width: 90% !important;
              max-height: 450px !important;
            }
          }
          
          @media (min-width: 768px) {
            .prose-custom img {
              max-width: 600px !important;
              max-height: 400px !important;
            }
          }
          
          @media (min-width: 1024px) {
            .prose-custom img {
              max-width: 700px !important;
              max-height: 450px !important;
            }
          }
          
          @media (min-width: 1280px) {
            .prose-custom img {
              max-width: 800px !important;
              max-height: 500px !important;
            }
          }
        `
      }} />
      
      {questions.map((question, index) => {
        // Sort content blocks by order
        const sortedBlocks = question.content_blocks 
          ? [...question.content_blocks].sort((a, b) => (a.order || 0) - (b.order || 0))
          : [];

        // Use stable ID for keys and IDs
        const questionId = question._id || `question-${index}`;
        const questionIndex = index;

        return (
          <article
            id={`question-${questionIndex}`}
            key={questionId}
            className="bg-[#161B33] rounded-xl border border-gray-800 p-6 sm:p-8 hover:border-[#6366F1] transition-all scroll-mt-20"
            aria-labelledby={`question-title-${questionIndex}`}
            role="article"
          >
            <div className="mb-6">
              <h2 
                id={`question-title-${questionIndex}`}
                className="text-xl sm:text-2xl font-bold text-white leading-relaxed mb-3"
              >
                <span 
                  className="inline-flex items-center justify-center w-8 h-8 bg-[#6366F1] text-white font-bold text-sm rounded-full align-middle mr-3 md:mr-2"
                  aria-label={`Question number ${questionIndex + 1}`}
                >
                  {questionIndex + 1}
                </span>
                {question.title.replace(/<[^>]*>/g, '')}
              </h2>
              {question.difficulty && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#0A0E27] border border-gray-700 rounded-lg text-white mb-4">
                  {question.difficulty}
                </span>
              )}
              
              {question.description && (
                <div className="sm:ml-11 mb-4">
                  {parseDescriptionWithSyntaxHighlighting(question.description)}
                </div>
              )}
            </div>
            
            {/* Content Blocks */}
            {sortedBlocks.length > 0 && (
              <div className="sm:ml-11 space-y-4">
                {sortedBlocks.map((block, blockIndex) => {
                  if (block.type === 'code') {
                    const codeLanguage = detectLanguage(block.code || '', block.language);
                    const blockId = `${questionId}-block-${blockIndex}`;
                    const blockKey = `${questionId}-${block.order || blockIndex}-${block.type}`;
                    
                    return (
                      <div key={blockKey} className="relative">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-800">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-400 uppercase">{codeLanguage}</span>
                            {block.label && (
                              <span className="text-xs text-gray-500">- {block.label}</span>
                            )}
                          </div>
                          <button
                            onClick={() => copyCode(block.code || '', blockId)}
                            className="text-xs text-white hover:text-[#6366F1] flex items-center gap-1 cursor-pointer transition-colors"
                            aria-label={copied === blockId ? 'Code copied to clipboard' : 'Copy code to clipboard'}
                          >
                            {copied === blockId ? (
                              <>
                                <Check className="h-4 w-4 text-[#6366F1]" aria-hidden="true" />
                                <span className="font-bold text-[#6366F1]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" aria-hidden="true" />
                                <span className="font-bold">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="my-2">
                          <SyntaxHighlighter
                            language={codeLanguage}
                            style={vscDarkPlus}
                            customStyle={{
                              borderRadius: '0.5rem',
                              padding: '1rem',
                              fontSize: '0.875rem',
                              lineHeight: '1.5',
                              margin: 0,
                              backgroundColor: '#1e1e1e',
                            }}
                            PreTag="div"
                          >
                            {block.code || ''}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    );
                  } else {
                    const blockKey = `${questionId}-${block.order || blockIndex}-${block.type}`;
                    return (
                      <div key={blockKey} className="prose-custom text-white/80">
                        {parseDescriptionWithSyntaxHighlighting(block.text_content || '')}
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

