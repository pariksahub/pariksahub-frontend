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
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search FAQs by topic or keyword..."
          className="block w-full pl-12 pr-24 py-3.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C0A063] focus:border-transparent transition-shadow"
          aria-label="Search FAQs by topic or keyword"
        />
        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
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
  );
}

