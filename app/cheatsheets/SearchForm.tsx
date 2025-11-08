'use client';

import React, { useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  search?: string;
  category?: string;
  categories: string[];
}

export default function SearchForm({ search, category, categories }: SearchFormProps) {

  useEffect(() => {
    // Smooth scroll to results section when search or category changes
    if (search || category) {
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [search, category]);

  return (
    <>
      <div className="max-w-2xl">
        <form 
          action="/cheatsheets" 
          method="get" 
          className="bg-white border border-gray-200 rounded-xl shadow-sm focus-within:border-gray-300 transition-colors"
        >
          <div className="relative px-4 py-3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              placeholder="Search cheatsheets..."
              defaultValue={search || ''}
              className="block w-full pl-10 pr-24 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none"
              aria-label="Search cheatsheets by title, description, or tags"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#C0A063] text-white rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium cursor-pointer"
                aria-label="Search cheatsheets"
              >
                Search
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Category</span>
              {category && (
                <a
                  href="/cheatsheets"
                  className="text-xs font-medium hover:underline text-[#C0A063] cursor-pointer"
                  aria-label="Clear category filter"
                >
                  Clear
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`/cheatsheets?category=${encodeURIComponent(cat)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-block cursor-pointer ${
                    category === cat 
                      ? 'bg-[#C0A063] text-white border-none' 
                      : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}
                  aria-label={`Filter cheatsheets by ${cat} category`}
                  aria-pressed={category === cat ? 'true' : 'false'}
                  role="button"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

