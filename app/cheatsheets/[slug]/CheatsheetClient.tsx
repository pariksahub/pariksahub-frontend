'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CheatsheetItem {
  _id?: string;
  title: string;
  description?: string;
  category?: string;
  content_type: 'code' | 'text' | 'mixed';
  code?: string;
  language?: string;
  text_content?: string;
  mixed_content?: Array<{
    type: 'code' | 'text';
    content: string;
    language?: string;
  }>;
  order?: number;
}

interface CheatsheetClientProps {
  items: CheatsheetItem[];
  itemCategories: string[];
}

export default function CheatsheetClient({ items, itemCategories }: CheatsheetClientProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    // Smooth scroll to the items section after a brief delay to allow state update
    setTimeout(() => {
      const itemsSection = document.getElementById('cheatsheet-items');
      if (itemsSection) {
        itemsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const renderItemContent = (item: CheatsheetItem, itemId: string) => {
    switch (item.content_type) {
      case 'code':
        return (
          <div className="relative">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
              <span className="text-xs font-mono text-gray-500 uppercase">{item.language || 'code'}</span>
              <button
                onClick={() => copyCode(item.code || '', itemId)}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer transition-colors"
                aria-label={copied === itemId ? 'Code copied to clipboard' : 'Copy code to clipboard'}
              >
                {copied === itemId ? <Check className="h-3 w-3" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
                {copied === itemId ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto text-sm font-mono leading-relaxed">
              <code className="text-gray-800">{item.code}</code>
            </pre>
          </div>
        );

      case 'text':
        return (
          <div 
            className="prose-custom quill-content"
            dangerouslySetInnerHTML={{ __html: item.text_content || '' }}
          />
        );

      case 'mixed':
        return (
          <div className="space-y-4">
            {item.mixed_content && item.mixed_content.map((block, blockIndex) => (
              <div key={blockIndex}>
                {block.type === 'code' ? (
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                      <span className="text-xs font-mono text-gray-500 uppercase">{block.language || 'code'}</span>
                      <button
                        onClick={() => copyCode(block.content || '', `${itemId}-${blockIndex}`)}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer transition-colors"
                        aria-label={copied === `${itemId}-${blockIndex}` ? 'Code copied to clipboard' : 'Copy code to clipboard'}
                      >
                        {copied === `${itemId}-${blockIndex}` ? <Check className="h-3 w-3" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
                        {copied === `${itemId}-${blockIndex}` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto text-sm font-mono leading-relaxed">
                      <code className="text-gray-800">{block.content}</code>
                    </pre>
                  </div>
                ) : (
                  <div 
                    className="prose-custom quill-content"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Category Filter */}
      {itemCategories.length > 1 && (
        <div className="no-print mb-8 pb-6 border-b border-gray-200 print:hidden">
          <div className="flex flex-wrap gap-2">
            {itemCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-sm font-medium rounded transition ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={`Filter by ${cat === 'all' ? 'all categories' : cat} category`}
                aria-pressed={selectedCategory === cat ? 'true' : 'false'}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table of Contents */}
      {filteredItems.length > 3 && (
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredItems.map((item, index) => (
              <a
                key={index}
                href={`#item-${index}`}
                className="text-sm text-gray-700 hover:text-gray-900 underline transition-colors"
                aria-label={`Jump to ${item.title}`}
              >
                {index + 1}. {item.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div id="cheatsheet-items" className="space-y-10">
        {filteredItems.map((item, index) => (
          <div 
            key={index} 
            id={`item-${index}`}
            className="scroll-mt-20"
          >
            <div className="mb-4 flex items-start gap-4">
              <span className="text-3xl font-bold text-gray-300 leading-none pt-1">
                {index + 1}
              </span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="text-gray-600 text-sm">{item.description}</p>
                )}
                {item.category && selectedCategory === 'all' && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {item.category}
                  </span>
                )}
              </div>
            </div>
            
            <div className="pl-4 border-l-2 border-gray-300">
              {renderItemContent(item, `item-${index}`)}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found for the selected category.</p>
        </div>
      )}
    </>
  );
}

