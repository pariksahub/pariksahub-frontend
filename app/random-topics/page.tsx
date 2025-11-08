 
import Link from 'next/link';
import { AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { fetchFromApi } from '../../utils/serverApi';
import { formatDisplayText } from '../../utils/textUtils';
import CountSelect from './CountSelect';

interface Subtopic {
  _id: string;
  subtopic_name: string;
  topic_id: {
    topic_name: string;
  };
}

interface RandomTopicsPageProps {
  searchParams: Promise<{ count?: string }>;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function getRandomSubtopics(count: number = 5): Promise<Subtopic[]> {
  try {
    const allSubtopics = await fetchFromApi('/api/subtopics/all') as Subtopic[];
    if (!allSubtopics || allSubtopics.length === 0) {
      return [];
    }
    
    // Shuffle array and take requested number or maximum available
    const shuffled = shuffleArray(allSubtopics);
    const actualCount = Math.min(count, allSubtopics.length);
    return shuffled.slice(0, actualCount);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    throw new Error('Failed to load subtopics. Please try again later.');
  }
}

export default async function RandomTopics({ searchParams }: RandomTopicsPageProps) {
  const { count } = await searchParams;
  const selectedCount = count ? parseInt(count, 10) : 5;
  const validCount = [3, 5, 7, 10].includes(selectedCount) ? selectedCount : 5;
  
  let subtopics: Subtopic[] = [];
  let error: string | null = null;

  try {
    subtopics = await getRandomSubtopics(validCount);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load subtopics. Please try again later.';
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
            href="/random-topics"
            className="bg-[#C0A063] text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 text-lg shadow-md hover:shadow-xl inline-block"
            aria-label="Try loading random topics again"
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
              <span>Random Practice</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Random <span className="text-[#C0A063]">Practice Topics</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              Discover random topics from all subjects and practice diverse questions across multiple areas for comprehensive exam preparation.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Count Filter */}
              <form action="/random-topics" method="get" className="inline-block">
                <CountSelect defaultValue={validCount.toString()} />
              </form>
              
              {/* Refresh Button */}
              <Link
                href={`/random-topics${validCount !== 5 ? `?count=${validCount}` : ''}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#C0A063] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium max-w-fit"
                aria-label="Refresh random topics"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Refresh
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="results-section" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-[#192A41]">
                Random Practice Topics
              </h2>
              <p className="text-sm text-gray-700">
                {subtopics.length} {subtopics.length === 1 ? 'topic' : 'topics'} available
              </p>
            </div>
          </div>
          
          {subtopics.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-xl bg-gray-100 mx-auto mb-4" aria-hidden="true"></div>
              <h3 className="text-lg font-semibold mb-2 text-[#192A41]">No Topics Available</h3>
              <p className="text-sm text-gray-800">Topics will appear here once they are added to the system.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {subtopics.map((subtopic) => (
                <Link
                  key={subtopic._id}
                  href={`/practice/${subtopic.topic_id.topic_name}/${subtopic.subtopic_name}`}
                  className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 hover:border-[#C0A063] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] block"
                  aria-label={`Start practicing ${formatDisplayText(subtopic.subtopic_name)} from ${formatDisplayText(subtopic.topic_id.topic_name)}`}
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C0A063]" />
                  
                  <div className="p-6 flex flex-col flex-grow min-h-[160px]">
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 text-[#192A41] leading-tight">
                      {formatDisplayText(subtopic.subtopic_name)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-auto">
                      from {formatDisplayText(subtopic.topic_id.topic_name)}
                    </p>

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
    </div>
  );
}

