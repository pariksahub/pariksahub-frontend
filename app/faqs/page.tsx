
import Link from 'next/link';
import { AlertCircle, Star, HelpCircle, ArrowRight } from 'lucide-react';
import { fetchFromApi } from '../../utils/serverApi';
import SearchForm from './SearchForm';
import ScrollToTopButton from '../../components/ScrollToTopButton';

interface FAQ {
  _id: string;
  topic_title: string;
  slug: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  views?: number;
}

interface FAQsPageProps {
  searchParams: Promise<{ search?: string }>;
}

async function getAllFAQs(): Promise<FAQ[]> {
  try {
    const data = await fetchFromApi('/api/faqs/all?limit=100') as { faqs?: FAQ[] };
    return data.faqs || [];
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw new Error('Failed to load FAQs');
  }
}

async function getFeaturedFAQs(): Promise<FAQ[]> {
  try {
    const data = await fetchFromApi('/api/faqs/featured/list') as FAQ[];
    return data || [];
  } catch (error) {
    console.error('Error fetching featured FAQs:', error);
    return [];
  }
}

function filterFAQs(faqs: FAQ[], search?: string): FAQ[] {
  let filtered = [...faqs];

  if (search) {
    const searchTerm = search.toLowerCase();
    filtered = filtered.filter(faq => 
      faq.topic_title.toLowerCase().includes(searchTerm) ||
      faq.description?.toLowerCase().includes(searchTerm) ||
      faq.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  return filtered;
}

export default async function FAQs({ searchParams }: FAQsPageProps) {
  const { search } = await searchParams;

  let allFAQs: FAQ[] = [];
  let featuredFAQs: FAQ[] = [];
  let error: string | null = null;

  try {
    [allFAQs, featuredFAQs] = await Promise.all([
      getAllFAQs(),
      getFeaturedFAQs()
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load FAQs';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <main className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-full p-4 inline-block mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#192A41] mb-3">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <Link
            href="/faqs"
            className="bg-[#C0A063] text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 text-lg shadow-md hover:shadow-xl inline-block"
            aria-label="Try again to load FAQs"
          >
            Try Again
          </Link>
        </main>
      </div>
    );
  }

  const faqs = filterFAQs(allFAQs, search);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 bg-[#FEF3E2] text-[#C0A063]">
              <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Help & Support</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Find answers to common questions about competitive exams, study resources, exam patterns, and preparation strategies. Everything you need to know in one place.
            </p>
          </div>
          
          {/* Search */}
          <SearchForm search={search} />
        </div>
      </section>

   
      {/* Featured Section */}
      {featuredFAQs.length > 0 && !search && (
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#192A41]">
                Featured FAQs
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {featuredFAQs.map((faq) => (
                <Link
                  key={faq._id}
                  href={`/faqs/${faq.slug}`}
                  className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.06)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] block"
                  aria-label={`View ${faq.topic_title} FAQ`}
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C0A063]" />
                  
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3E2] text-[#C0A063]">
                        <Star className="w-3 h-3" fill="currentColor" aria-hidden="true" />
                        <span>Featured</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 transition-colors group-hover:opacity-80 text-[#192A41]">
                      {faq.topic_title}
                    </h3>

                    {/* Description */}
                    {faq.description && (
                      <p className="text-sm text-gray-800 mb-4 line-clamp-2 leading-relaxed">{faq.description}</p>
                    )}

                    {/* Footer - Always at bottom */}
                    <div className="mt-auto pt-4">
                      {/* Tags */}
                      {faq.tags && faq.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-100">
                          {faq.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs px-2.5 py-1 rounded-md font-medium bg-gray-50 text-gray-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="mb-4 pb-4 border-b border-gray-100"></div>
                      )}

                      {/* Views & CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#C0A063]">
                          View Answers
                        </span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-[#C0A063]" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All FAQs */}
      <section id="results-section" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-[#192A41]">
                All FAQs
              </h2>
              <p className="text-sm text-gray-700">
                {faqs.length} {faqs.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            
          </div>
          
          {faqs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#192A41]">No Results Found</h3>
              <p className="text-sm text-gray-800 mb-6">Try adjusting your search or filters</p>
              <Link
                href="/faqs"
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 bg-[#C0A063] inline-block"
                aria-label="Clear filters and show all FAQs"
              >
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {faqs.map((faq) => (
                <Link
                  key={faq._id}
                  href={`/faqs/${faq.slug}`}
                  className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.06)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] block"
                  aria-label={`View ${faq.topic_title} FAQ`}
                >
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C0A063]" />
                    
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Icon */}
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110 bg-[#C0A06315]"
                      >
                        <HelpCircle className="w-5 h-5 text-[#C0A063]" />
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold mb-3 line-clamp-2 transition-colors group-hover:opacity-80 text-[#192A41]">
                        {faq.topic_title}
                      </h3>
                      
                      {/* Featured Badge */}
                      {faq.featured && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 bg-[#FEF3E2] text-[#C0A063]">
                            <Star className="w-3 h-3" fill="currentColor" aria-hidden="true" />
                            Featured
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      {faq.description && (
                        <p className="text-xs text-gray-800 mb-3 line-clamp-2 leading-relaxed">{faq.description}</p>
                      )}

                      {/* Footer - Always at bottom */}
                      <div className="mt-auto pt-4">
                        {/* Tags */}
                        {faq.tags && faq.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-gray-100">
                            {faq.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 rounded font-medium bg-gray-50 text-gray-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="mb-4 pb-4 border-b border-gray-100"></div>
                        )}

                        {/* CTA */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#C0A063]">
                            View
                          </span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#C0A063]" aria-hidden="true" />
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
                  This page provides answers to the most common questions about competitive exams, study materials, and test preparation. Each FAQ section covers a specific topic with clear, concise answers.
                </p>
                <p>
                 <strong>What you'll find:</strong> Questions about exam patterns, syllabus coverage, preparation strategies, time management, study resources, and general guidance for various competitive examinations.
                </p>
                <p>
                 <strong>How to use it:</strong> Browse through the topics or use the search to find specific questions. Click on any FAQ topic to see all the questions and answers related to that subject. If you don't find what you're looking for, feel free to suggest new topics.
                </p>
              </div>
            </div>
          </section>

      <ScrollToTopButton />
    </div>
  );
}

