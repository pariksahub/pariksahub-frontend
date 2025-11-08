'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchFormProps {
  search?: string;
}

export default function SearchForm({ search }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(search || '');

  useEffect(() => {
    setSearchTerm(search || '');
  }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    
    const url = params.toString() ? `/faqs?${params.toString()}` : '/faqs';
    router.push(url);
  };

  const handleClear = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    const url = params.toString() ? `/faqs?${params.toString()}` : '/faqs';
    router.push(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-[#161B33] border border-gray-800 rounded-xl focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all">
        <div className="relative px-4 py-3">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs by topic or keyword..."
            className="block w-full pl-10 pr-24 py-2 text-sm text-white placeholder-gray-500 bg-transparent outline-none"
            aria-label="Search FAQs by topic or keyword"
          />
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2">
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
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
      </div>
    </form>
  );
}

