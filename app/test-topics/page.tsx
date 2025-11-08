import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { fetchFromApi } from '../../utils/serverApi';
import { formatDisplayText } from '../../utils/textUtils';

interface Topic {
  _id: string;
  topic_name: string;
}

async function getTopics(): Promise<Topic[]> {
  try {
    const data = await fetchFromApi('/api/topics/all') as Topic[];
    return data || [];
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw new Error('Failed to load topics. Please try again later.');
  }
}

export default async function TestTopics() {
  let topics: Topic[] = [];
  let error: string | null = null;

  try {
    topics = await getTopics();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load topics. Please try again later.';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center p-4 pt-20">
        <main className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-3">Error Loading Topics</h1>
          <p className="text-slate-700 text-lg">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-4 text-center">Select a Topic</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-12 text-center">Choose a topic to start your online test</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic._id}
              href={`/test-topics/${topic.topic_name}`}
              className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-orange-300 transition-all duration-300 text-left w-full hover:scale-105 block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-orange-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="relative text-xl font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                {formatDisplayText(topic.topic_name)}
              </h3>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-600 to-orange-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

