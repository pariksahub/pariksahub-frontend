import React from 'react';
import Link from 'next/link';
import { AlertCircle, FileText, ArrowRight, Search, X, ChevronDown } from 'lucide-react';
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
      <div className="bg-gray-50">
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-full p-4 inline-block mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
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
          </div>
        </main>
      </div>
    );
  }

  const filteredSubtopics = filterSubtopics(subtopics, search);
  const groupedSubtopics = groupSubtopics(filteredSubtopics);

  return (
    <div className="bg-gray-50">
      <main className="bg-white">
        <section className="bg-[#192A41] text-white mt-10">
          <div className="container mx-auto px-6 py-8">
            <nav className="mb-8 text-sm text-gray-300" aria-label="Breadcrumb navigation">
              <Link href="/practice" className="hover:text-white transition duration-300" aria-label="Go to practice topics">Practice</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="text-[#C0A063] font-medium">{formatDisplayText(topicName)}</span>
            </nav>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                {formatDisplayText(topicName)} <span className="text-[#C0A063]">Subtopics</span>
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-200 mb-4">
                Choose a specific subtopic to practice and master your skills
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Select from the available subtopics below to start practicing
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                {/* Exam Filter */}
                <div className="relative">
                  <form action={`/practice/${topicName}`} method="get" className="inline-block">
                    <input type="hidden" name="search" value={search || ''} />
                    <div className="relative">
                      <select
                        name="exam"
                        defaultValue={selectedExam}
                        className="bg-white/10 backdrop-blur-sm border border-gray-500 rounded-lg px-6 py-3 min-w-[200px] text-left text-white text-sm appearance-none cursor-pointer hover:bg-white/20 transition-colors pr-8"
                        aria-label="Filter subtopics by exam type"
                      >
                        <option value="" className="text-gray-800">Choose Exam (optional)</option>
                        {exams.map((exam) => (
                          <option key={exam._id} value={exam.exam_name} className="text-gray-800">
                            {formatDisplayText(exam.exam_name).toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                    </div>
                    <button type="submit" className="sr-only" aria-label="Apply exam filter">Apply Filter</button>
                  </form>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <form action={`/practice/${topicName}`} method="get" className="relative">
                    <input type="hidden" name="exam" value={selectedExam} />
                    <div className={`relative bg-white/10 backdrop-blur-sm border rounded-lg transition-all duration-300 ${
                      search ? 'border-[#C0A063] ring-2 ring-[#C0A063]/20' : 'border-gray-500'
                    }`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="search"
                        defaultValue={search || ''}
                        placeholder="Search subtopics..."
                        className="block w-full pl-10 pr-10 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0 text-sm"
                        aria-label="Search subtopics by name"
                      />
                      {search && (
                        <Link
                          href={`/practice/${topicName}${selectedExam ? `?exam=${encodeURIComponent(selectedExam)}` : ''}`}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                          aria-label="Clear search"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                    <button type="submit" className="sr-only" aria-label="Submit search">Search</button>
                  </form>
                  
                  {search && (
                    <div className="absolute top-full left-0 mt-2 text-sm text-gray-300">
                      {filteredSubtopics.length} subtopic{filteredSubtopics.length !== 1 ? 's' : ''} found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            {search && filteredSubtopics.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#192A41] mb-4">No Results Found</h3>
                  <p className="text-gray-600 mb-6">
                    No subtopics match your search for "{search}". Try a different search term.
                  </p>
                  <Link
                    href={`/practice/${topicName}${selectedExam ? `?exam=${encodeURIComponent(selectedExam)}` : ''}`}
                    className="bg-[#C0A063] text-white font-semibold px-6 py-2 rounded-full hover:bg-opacity-90 transition duration-300 inline-block"
                    aria-label="Clear search and show all subtopics"
                  >
                    Clear Search
                  </Link>
                </div>
              </div>
            ) : Object.keys(groupedSubtopics).length === 0 && !search ? (
              <div className="text-center py-20">
                <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6" aria-hidden="true"></div>
                  <h3 className="text-2xl font-bold text-[#192A41] mb-4">No Subtopics Available</h3>
                  <p className="text-gray-600">Subtopics will appear here once they are added for this topic.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(groupedSubtopics).map(([category, categorySubtopics]) => (
                  <div key={category}>
                    <div className="text-center mb-16">
                      <h3 className="text-3xl font-bold text-[#192A41] mb-3">
                        {category}
                        {search && (
                          <span className="text-lg font-normal text-gray-500 ml-2">
                            ({categorySubtopics.length} result{categorySubtopics.length !== 1 ? 's' : ''})
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-lg">Select a subtopic to begin practicing.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categorySubtopics.map((subtopic) => {
                        const targetRoute = selectedExam 
                          ? `/practice/${topicName}/${subtopic.subtopic_name}/${selectedExam}`
                          : `/practice/${topicName}/${subtopic.subtopic_name}`;
                        return (
                          <Link
                            key={subtopic._id}
                            href={targetRoute}
                            className="relative group cursor-pointer transition-all duration-300 hover:-translate-y-1 block"
                            aria-label={`Start practicing ${formatDisplayText(subtopic.subtopic_name)}`}
                          >
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full flex flex-col justify-between hover:border-[#C0A063] hover:shadow-xl transition-all duration-300">
                              <div className="flex items-start justify-between mb-6">
                                <div className="flex items-start space-x-3 flex-1 pr-4">
                                  <div className="bg-[#C0A063] text-white rounded-full p-2 transition-transform duration-300 flex-shrink-0 group-hover:scale-110" aria-hidden="true">
                                    <FileText className="w-4 h-4" aria-hidden="true" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-xl font-semibold text-[#192A41] leading-snug">
                                      {formatDisplayText(subtopic.subtopic_name)}
                                    </h4>
                                  </div>
                                </div>
                                <div className="transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#C0A063] text-gray-400" aria-hidden="true">
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
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

