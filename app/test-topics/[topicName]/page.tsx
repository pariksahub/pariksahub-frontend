import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, BookOpen } from 'lucide-react';
import { fetchFromApi } from '../../../utils/serverApi';
import { formatDisplayText } from '../../../utils/textUtils';
import TestSubtopicCard from './TestSubtopicCard';

interface Subtopic {
  _id: string;
  subtopic_name: string;
}

interface TestSubTopicsPageProps {
  params: Promise<{ topicName: string }>;
}

async function getSubtopics(topicName: string): Promise<Subtopic[]> {
  try {
    const data = await fetchFromApi(`/api/subtopics/topicname/${encodeURIComponent(topicName)}`) as Subtopic[];
    return data || [];
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    throw new Error('Failed to load subtopics. Please try again later.');
  }
}

export default async function TestSubTopics({ params }: TestSubTopicsPageProps) {
  const { topicName } = await params;
  let subtopics: Subtopic[] = [];
  let error: string | null = null;

  try {
    subtopics = await getSubtopics(topicName);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load subtopics. Please try again later.';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center p-4 pt-20">
        <main className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-3">Error Loading Subtopics</h1>
          <p className="text-slate-700 text-lg">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Link 
            href="/test-topics"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Topics
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 text-center mb-4">
            {formatDisplayText(topicName)}
          </h1>
          <h2 className="text-xl font-semibold text-slate-700 text-center mb-8">
            Select a subtopic to start your online test
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subtopics.map((subtopic) => (
            <TestSubtopicCard key={subtopic._id} subtopic={subtopic} />
          ))}
        </div>

        {subtopics.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Subtopics Available</h3>
            <p className="text-slate-600">Subtopics will appear here once they are added for this topic.</p>
          </div>
        )}
      </div>
    </div>
  );
}

