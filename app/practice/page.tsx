import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, FileText, Target } from 'lucide-react';
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

export default async function Practice() {
  let topics: Topic[] = [];
  let error: string | null = null;

  try {
    topics = await getTopics();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load topics. Please try again later.';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <main className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-full p-4 inline-block mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-[#192A41] mb-3">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <Link
            href="/practice"
            className="bg-[#C0A063] text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 text-lg shadow-md hover:shadow-xl inline-block"
            aria-label="Try loading practice topics again"
          >
            Try Again
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 bg-[#FEF3E2] text-[#C0A063]">
              <Target className="w-3 h-3" aria-hidden="true" />
              <span>Practice Resources</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Practice Questions for Competitive Exams
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Free practice questions with detailed solutions. MCQs for aptitude, reasoning, quantitative ability, and technical topics for SSC, RRB, banking exams, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="results-section" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-[#192A41]">
                Available Topics
              </h2>
              <p className="text-sm text-gray-700">
                {topics.length} {topics.length === 1 ? 'topic' : 'topics'} available
              </p>
            </div>
          </div>
          
          {topics.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#192A41]">No Topics Available</h3>
              <p className="text-sm text-gray-800">Topics will appear here once they are added.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {topics.map((topic) => (
                <Link
                  key={topic._id}
                  href={`/practice/${topic.topic_name}`}
                  className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 hover:border-[#C0A063] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] block"
                  aria-label={`Start practicing ${formatDisplayText(topic.topic_name)} questions`}
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C0A063]" />
                  
                  <div className="p-6 flex flex-col flex-grow min-h-[160px]">
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-auto line-clamp-3 text-[#192A41] leading-tight">
                      {formatDisplayText(topic.topic_name)}
                    </h3>

                    {/* Footer - Always at bottom */}
                    <div className="mt-3 pt-4 border-t border-gray-200">
                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#C0A063]">
                          Start Practice
                        </span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-[#C0A063]" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-800 space-y-4 leading-relaxed">
            <p>
              Welcome to PariksaHub's practice section, your only resource for free competitive exam preparation. We have resources for preparing for SSC, RRB, banking exams, or other government competitive tests, we offer a comprehensive collection of practice questions designed to help you succeed.
            </p>
            <p>
              <strong>What you'll find:</strong> Our practice questions cover all major topics including quantitative aptitude, logical reasoning, verbal ability, and technical subjects. Each question comes with detailed explanations to help you understand the concepts and improve your problem-solving skills.
            </p>
            <p>
              <strong>How to use it:</strong> The questions are organized by topics, making it easy to focus on specific areas. You can practice at your own pace, track your progress, and identify areas that need more attention. Whether you want to strengthen your mathematical skills, improve your reasoning abilities, or master technical concepts, you'll find relevant practice material here.
            </p>
            <p>
              <strong>If you think we're helping you, please share your kind words with us — they mean a lot to us 💖💖💖</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

