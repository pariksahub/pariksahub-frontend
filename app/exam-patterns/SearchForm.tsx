'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

interface SearchFormProps {
  search?: string;
  examLevels: string[];
  selectedLevel?: string;
}

export default function SearchForm({ search, examLevels, selectedLevel }: SearchFormProps) {
  useEffect(() => {
    // Smooth scroll to results section when search or level changes
    if (search || selectedLevel) {
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [search, selectedLevel]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 sm:max-w-md">
        <form action="/exam-patterns" method="get" className="relative">
          <input type="hidden" name="exam_level" value={selectedLevel || ''} />
          <div className={`relative bg-white border rounded-lg transition-all duration-300 ${
            search ? 'border-[#C0A063] ring-2 ring-[#C0A063]/20' : 'border-gray-300'
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Search exams..."
              className="block w-full pl-10 pr-24 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 text-sm"
              aria-label="Search exams by name"
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2">
              {search && (
                <Link
                  href={`/exam-patterns${selectedLevel ? `?exam_level=${encodeURIComponent(selectedLevel)}` : ''}`}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-[#C0A063] text-white text-sm font-medium rounded-md hover:bg-opacity-90 transition-all"
                aria-label="Submit search"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Level Filter */}
      {examLevels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {!examLevels.includes('All') && (
            <Link
              href={`/exam-patterns${search ? `?search=${encodeURIComponent(search)}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-block ${
                !selectedLevel
                  ? 'bg-[#C0A063] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Show all exam levels"
            >
              All
            </Link>
          )}
          {examLevels.map((level) => (
            <Link
              key={level}
              href={`/exam-patterns?exam_level=${encodeURIComponent(level)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-block ${
                selectedLevel === level
                  ? 'bg-[#C0A063] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={`Filter by ${level} level`}
            >
              {level}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

