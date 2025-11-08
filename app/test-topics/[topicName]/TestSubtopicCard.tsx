'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { formatDisplayText } from '../../../utils/textUtils';

interface Subtopic {
  _id: string;
  subtopic_name: string;
}

interface TestSubtopicCardProps {
  subtopic: Subtopic;
}

export default function TestSubtopicCard({ subtopic }: TestSubtopicCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/onlinetest/${subtopic.subtopic_name}`);
  };

  return (
    <button
      onClick={handleClick}
      className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-orange-300 transition-all duration-300 text-left w-full hover:scale-105"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-orange-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
            {formatDisplayText(subtopic.subtopic_name)}
          </h3>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-600 to-orange-400 group-hover:w-full transition-all duration-300"></div>
    </button>
  );
}

