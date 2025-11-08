import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
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
      <div className="bg-gray-50">
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-full p-4 inline-block mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
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
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <main className="bg-white">
        {/* Hero Section */}
        <section className="bg-[#192A41] text-white mt-10">
          <div className="container mx-auto px-3 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Practice Questions for Competitive Exams
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Select a topic to start your practice journey and enhance your skills for competitive exams.
            </p>
          </div>
        </section>

     
        {/* Topics Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <header className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#192A41] mb-3">Available Topics</h2>
              <p className="text-gray-600 text-lg">Select from our comprehensive collection of practice topics to begin your preparation journey.</p>
            </header>

            {topics.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6" aria-hidden="true"></div>
                  <h3 className="text-2xl font-bold text-[#192A41] mb-4">No Topics Available</h3>
                  <p className="text-gray-600">Topics will appear here once they are added.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {topics.map((topic) => (
                  <Link
                    key={topic._id}
                    href={`/practice/${topic.topic_name}`}
                    className="relative group cursor-pointer transition-all duration-300 hover:-translate-y-1 block"
                    aria-label={`Start practicing ${formatDisplayText(topic.topic_name)} questions`}
                  >
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full flex flex-col justify-between hover:border-[#C0A063] hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1 pr-4">
                          <h4 className="text-xl font-semibold text-[#192A41] leading-snug">
                            {formatDisplayText(topic.topic_name)}
                          </h4>
                        </div>
                        <div className="transition-all duration-300 group-hover:transform group-hover:translate-x-1 group-hover:text-[#C0A063] text-gray-400">
                          <ArrowRight className="h-6 w-6" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-sm font-medium transition-all duration-300 group-hover:text-[#C0A063] text-gray-500">
                          Start Practice
                        </div>
                      </div>

                      <div className="absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none group-hover:bg-gradient-to-br group-hover:from-[#C0A063]/5 group-hover:to-transparent"></div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

           {/* Introduction Section */}
           <section className="py-12 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose prose-lg max-w-none text-gray-800 space-y-4 leading-relaxed">
              <p>
                Welcome to PariksaHub's practice section, your  only  resource for free competitive exam preparation. We have resources for preparing for SSC, RRB, banking exams, or other government competitive tests, we offer a comprehensive collection of practice questions designed to help you succeed.
              </p>
              <p>
                Our practice questions cover all major topics including quantitative aptitude, logical reasoning, verbal ability, and technical subjects. Each question comes with detailed explanations to help you understand the concepts and improve your problem-solving skills. You can practice at your own pace, track your progress, and identify areas that need more attention.
              </p>
              <p>
                The questions are organized by topics, making it easy to focus on specific areas. Whether you want to strengthen your mathematical skills, improve your reasoning abilities, or master technical concepts, you'll find relevant practice material here. Start practicing today and take a step closer to achieving your career goals.
              </p>
              <p><strong>If you think we're helping you, please share your kind words with us — they mean a lot to us 💖💖💖</strong></p>

             </div>
          </div>
        </section>

      </main>
    </div>
  );
}

