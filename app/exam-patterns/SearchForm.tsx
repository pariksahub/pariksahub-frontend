'use client';

import React, { useEffect } from 'react';
import { Search } from 'lucide-react';

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
    <>
      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-6">
        <form action="/exam-patterns" method="get" className="bg-white rounded-lg shadow-md flex items-center px-4 py-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="search"
            placeholder="Search exams..."
            defaultValue={search || ''}
            className="flex-1 px-3 py-2 outline-none text-sm"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-[#C0A063] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Level Filter */}
      {examLevels.length > 0 && (
        <div className="max-w-xl mx-auto mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {examLevels.map((level) => (
              <a
                key={level}
                href={`/exam-patterns?exam_level=${encodeURIComponent(level)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-block cursor-pointer ${
                  selectedLevel === level
                    ? 'bg-[#C0A063] text-white border-none'
                    : 'bg-white/10 text-gray-300 border border-gray-500 hover:bg-white/20'
                }`}
              >
                {level}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

