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
          <div className="flex items-center px-4 py-3">
            <Search className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <input
              type="text"
              name="search"
              placeholder="Search cheatsheets..."
              defaultValue={search || ''}
              className="flex-1 px-4 py-1 outline-none text-sm text-gray-900 placeholder-gray-500"
              aria-label="Search cheatsheets by title, description, or tags"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-[#C0A063] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium cursor-pointer"
              aria-label="Search cheatsheets"
            >
              Search
            </button>
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

