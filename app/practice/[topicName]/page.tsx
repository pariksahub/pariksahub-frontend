import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Search, X, ChevronDown } from 'lucide-react';
import { fetchFromApi } from '../../../utils/serverApi';
import { formatDisplayText } from '../../../utils/textUtils';

interface Subtopic {
  _id: string;
  subtopic_name: string;
  category?: string;
}

interface Exam {
  _id: string;
  exam_name: string;
}

interface PracticeSubtopicsPageProps {
  params: Promise<{ topicName: string }>;
  searchParams: Promise<{ search?: string; exam?: string }>;
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

async function getExams(): Promise<Exam[]> {
  try {
    const data = await fetchFromApi('/api/exams/all') as Exam[];
    return data || [];
  } catch (error) {
    console.error('Error fetching exams:', error);
    return [];
  }
}

function filterSubtopics(subtopics: Subtopic[], search?: string): Subtopic[] {
  if (!search) return subtopics;
  const searchTerm = search.toLowerCase();
  return subtopics.filter(subtopic =>
    subtopic.subtopic_name.toLowerCase().includes(searchTerm) ||
    (subtopic.category && subtopic.category.toLowerCase().includes(searchTerm))
  );
}

function groupSubtopics(subtopics: Subtopic[]): Record<string, Subtopic[]> {
  return subtopics.reduce((acc: Record<string, Subtopic[]>, subtopic) => {
    const category = subtopic.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(subtopic);
    return acc;
  }, {});
}

export default async function SubTopics({ params, searchParams }: PracticeSubtopicsPageProps) {
  const { topicName } = await params;
  const { search, exam } = await searchParams;
  const selectedExam = exam || '';
  
  let subtopics: Subtopic[] = [];
  let exams: Exam[] = [];
  let error: string | null = null;

  try {
    [subtopics, exams] = await Promise.all([
      getSubtopics(topicName),
      getExams()
    ]);
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
            href={`/practice/${topicName}`}
            className="bg-[#C0A063] text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 text-lg shadow-md hover:shadow-xl inline-block"
            aria-label="Try loading subtopics again"
          >
            Try Again
          </Link>
        </main>
      </div>
    );
  }

  const filteredSubtopics = filterSubtopics(subtopics, search);
  const groupedSubtopics = groupSubtopics(filteredSubtopics);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-600" aria-label="Breadcrumb navigation">
            <Link href="/practice" className="hover:text-gray-900 transition-colors" aria-label="Go to practice topics">Practice</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-[#C0A063] font-medium">{formatDisplayText(topicName)}</span>
          </nav>

          {/* Header */}
          <div className="max-w-3xl mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              {formatDisplayText(topicName)} <span className="text-[#C0A063]">Subtopics</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
              Choose a specific subtopic to practice and master your skills. Select from the available subtopics below to start practicing.
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Exam Filter */}
              <div className="relative">
                <form action={`/practice/${topicName}`} method="get" className="inline-block">
                  <input type="hidden" name="search" value={search || ''} />
                  <div className="relative">
                    <select
                      name="exam"
                      defaultValue={selectedExam}
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 min-w-[180px] text-left text-gray-900 text-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors pr-8 focus:outline-none focus:ring-2 focus:ring-[#C0A063] focus:border-transparent"
                      aria-label="Filter subtopics by exam type"
                    >
                      <option value="">All Exams</option>
                      {exams.map((exam) => (
                        <option key={exam._id} value={exam.exam_name}>
                          {formatDisplayText(exam.exam_name)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                  </div>
                  <button type="submit" className="sr-only" aria-label="Apply exam filter">Apply Filter</button>
                </form>
              </div>

              {/* Search */}
              <div className="relative flex-1 sm:max-w-md">
                <form action={`/practice/${topicName}`} method="get" className="relative">
                  <input type="hidden" name="exam" value={selectedExam} />
                  <div className={`relative bg-white border rounded-lg transition-all duration-300 ${
                    search ? 'border-[#C0A063] ring-2 ring-[#C0A063]/20' : 'border-gray-300'
                  }`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      defaultValue={search || ''}
                      placeholder="Search subtopics..."
                      className="block w-full pl-10 pr-10 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 text-sm"
                      aria-label="Search subtopics by name"
                    />
                    {search && (
                      <Link
                        href={`/practice/${topicName}${selectedExam ? `?exam=${encodeURIComponent(selectedExam)}` : ''}`}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                  <button type="submit" className="sr-only" aria-label="Submit search">Search</button>
                </form>
                
                {search && (
                  <div className="absolute top-full left-0 mt-2 text-sm text-gray-600">
                    {filteredSubtopics.length} subtopic{filteredSubtopics.length !== 1 ? 's' : ''} found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subtopics Section */}
      <section id="results-section" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {search && filteredSubtopics.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#192A41]">No Results Found</h3>
              <p className="text-sm text-gray-800 mb-6">
                No subtopics match your search for "{search}". Try a different search term.
              </p>
              <Link
                href={`/practice/${topicName}${selectedExam ? `?exam=${encodeURIComponent(selectedExam)}` : ''}`}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 bg-[#C0A063] inline-block"
                aria-label="Clear search and show all subtopics"
              >
                Clear Search
              </Link>
            </div>
          ) : Object.keys(groupedSubtopics).length === 0 && !search ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-xl bg-gray-100 mx-auto mb-4" aria-hidden="true"></div>
              <h3 className="text-lg font-semibold mb-2 text-[#192A41]">No Subtopics Available</h3>
              <p className="text-sm text-gray-800">Subtopics will appear here once they are added for this topic.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedSubtopics).map(([category, categorySubtopics]) => (
                <div key={category}>
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-[#192A41]">
                      {category}
                      {search && (
                        <span className="text-base font-normal text-gray-500 ml-2">
                          ({categorySubtopics.length} result{categorySubtopics.length !== 1 ? 's' : ''})
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-gray-700">
                      {categorySubtopics.length} {categorySubtopics.length === 1 ? 'subtopic' : 'subtopics'} available
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                    {categorySubtopics.map((subtopic) => {
                      const targetRoute = selectedExam 
                        ? `/practice/${topicName}/${subtopic.subtopic_name}/${selectedExam}`
                        : `/practice/${topicName}/${subtopic.subtopic_name}`;
                      return (
                        <Link
                          key={subtopic._id}
                          href={targetRoute}
                          className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 hover:border-[#C0A063] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] block"
                          aria-label={`Start practicing ${formatDisplayText(subtopic.subtopic_name)}`}
                        >
                          {/* Top accent */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C0A063]" />
                          
                          <div className="p-6 flex flex-col flex-grow min-h-[160px]">
                            {/* Title */}
                            <h3 className="text-xl font-bold mb-auto line-clamp-3 text-[#192A41] leading-tight">
                              {formatDisplayText(subtopic.subtopic_name)}
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
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

