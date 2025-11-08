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
    <div className="w-full">
      <form action="/exam-patterns" method="get" className="bg-[#161B33] border border-gray-800 rounded-xl focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all">
        <input type="hidden" name="exam_level" value={selectedLevel || ''} />
        <div className="relative px-4 py-3">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            defaultValue={search || ''}
            placeholder="Search exams..."
            className="block w-full pl-10 pr-24 py-2 text-sm text-white placeholder-gray-500 bg-transparent outline-none"
            aria-label="Search exams by name"
          />
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2">
            {search && (
              <Link
                href={`/exam-patterns${selectedLevel ? `?exam_level=${encodeURIComponent(selectedLevel)}` : ''}`}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-[#6366F1] text-white text-sm font-bold rounded-lg hover:bg-[#5558E3] transition-colors cursor-pointer"
              aria-label="Submit search"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Level Filter */}
        {examLevels.length > 0 && (
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Level</span>
              {selectedLevel && (
                <Link
                  href={`/exam-patterns${search ? `?search=${encodeURIComponent(search)}` : ''}`}
                  className="text-xs font-medium hover:text-white transition-colors text-[#6366F1] cursor-pointer"
                  aria-label="Clear level filter"
                >
                  Clear
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {!examLevels.includes('All') && (
                <Link
                  href={`/exam-patterns${search ? `?search=${encodeURIComponent(search)}` : ''}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-block cursor-pointer ${
                    !selectedLevel
                      ? 'bg-[#6366F1] text-white'
                      : 'bg-[#0A0E27] text-gray-400 border border-gray-800 hover:border-[#6366F1] hover:text-white'
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-block cursor-pointer ${
                    selectedLevel === level
                      ? 'bg-[#6366F1] text-white'
                      : 'bg-[#0A0E27] text-gray-400 border border-gray-800 hover:border-[#6366F1] hover:text-white'
                  }`}
                  aria-label={`Filter by ${level} level`}
                >
                  {level}
                </Link>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

