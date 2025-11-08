 
import Link from 'next/link';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { fetchFromApi } from '../../utils/serverApi';
import { formatDisplayText } from '../../utils/textUtils';

interface Subtopic {
  _id: string;
  subtopic_name: string;
  topic_id: {
    topic_name: string;
  };
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

export default async function RandomTopics() {
  let subtopics: Subtopic[] = [];
  let error: string | null = null;

  try {
    subtopics = await getRandomSubtopics(5);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load subtopics. Please try again later.';
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <main className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-full p-4 inline-block mb-6">
            <RefreshCw className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#192A41] mb-3">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <a
            href="/random-topics"
            className="bg-[#C0A063] text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 text-lg shadow-md hover:shadow-xl inline-block"
          >
            Try Again
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="bg-white">
        {/* Hero Section */}
        <section className="bg-[#192A41] text-white mt-10">
          <div className="container mx-auto px-6 py-8 md:py-16 text-center">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6">
              Random <span className="text-[#C0A063]">Practice</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              Discover random topics from all subjects and practice diverse questions across multiple areas for comprehensive exam preparation.
            </p>
            
            <p className="text-xs md:text-sm text-gray-400">
              Showing {subtopics.length} random topic{subtopics.length !== 1 ? 's' : ''}
            </p>
          </div>
        </section>

        {/* Topics Section */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#192A41] mb-8 text-center">Random Practice Topics</h2>
            {subtopics.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6"></div>
                  <h3 className="text-2xl font-bold text-[#192A41] mb-4">No Topics Available</h3>
                  <p className="text-gray-600">Topics will appear here once they are added to the system.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {subtopics.map((subtopic, index) => (
                  <Link
                    key={subtopic._id}
                    href={`/practice/${subtopic.topic_id.topic_name}/${subtopic.subtopic_name}`}
                    className="relative group cursor-pointer transition-all duration-300 hover:-translate-y-1 block"
                  >
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full flex flex-col justify-between hover:border-[#C0A063] hover:shadow-xl transition-all duration-300">
                      {/* Topic Number and Name */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3 flex-1 pr-4">
                          <div className="w-8 h-8 bg-[#C0A063] text-white rounded-full flex items-center justify-center text-sm font-bold transition-transform duration-300 group-hover:scale-110">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-medium text-[#192A41] leading-snug">
                              {formatDisplayText(subtopic.subtopic_name)}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              from {formatDisplayText(subtopic.topic_id.topic_name)}
                            </p>
                          </div>
                        </div>
                        <div className="transition-all duration-300 group-hover:transform group-hover:translate-x-1 group-hover:text-[#C0A063] text-gray-400">
                          <ArrowRight className="h-6 w-6" />
                        </div>
                      </div>

                      {/* Start Practice Button */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-sm font-normal transition-all duration-300 group-hover:text-[#C0A063] text-gray-500">
                          Start Practice
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none group-hover:bg-gradient-to-br group-hover:from-[#C0A063]/5 group-hover:to-transparent"></div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

