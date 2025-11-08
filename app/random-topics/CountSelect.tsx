'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CountSelectProps {
  defaultValue: string;
}

export default function CountSelect({ defaultValue }: CountSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const form = e.target.closest('form');
    if (form) {
      form.submit();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="count-select" className="text-sm text-gray-700 font-medium">
        Show:
      </label>
      <div className="relative">
        <select
          id="count-select"
          name="count"
          defaultValue={defaultValue}
          onChange={handleChange}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 min-w-[120px] text-left text-gray-900 text-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors pr-8 focus:outline-none focus:ring-2 focus:ring-[#C0A063] focus:border-transparent"
          aria-label="Select number of topics to show"
        >
          <option value="3">3 Topics</option>
          <option value="5">5 Topics</option>
          <option value="7">7 Topics</option>
          <option value="10">10 Topics</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
}

