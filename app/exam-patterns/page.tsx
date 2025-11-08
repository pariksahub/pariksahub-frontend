import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, FileText } from 'lucide-react';
import { fetchFromApi } from '../../utils/serverApi';
import SearchForm from './SearchForm';

interface ExamPattern {
  _id: string;
  exam_name: string;
  slug: string;
  exam_level: string;
  exam_mode: string;
  total_questions: number;
  total_marks: number;
  duration: number;
  marking_scheme?: {
    correct_answer: number;
    wrong_answer: number;
    negative_marking: boolean;
    negative_marking_value: number;
  };
  featured?: boolean;
  description?: string;
}

interface ExamPatternsPageProps {
  searchParams: Promise<{ search?: string; exam_level?: string }>;
}

async function getAllExamPatterns(): Promise<{ examPatterns: ExamPattern[]; total: number }> {
  try {
    const data = await fetchFromApi('/api/exam-patterns/all?limit=100') as { examPatterns?: ExamPattern[]; pagination?: { total?: number } };
    return {
      examPatterns: data.examPatterns || [],
      total: data.pagination?.total || 0
    };
  } catch (error) {
    console.error('Error fetching exam patterns:', error);
    throw new Error('Failed to load exam patterns');
  }
}

async function getFeaturedExams(): Promise<ExamPattern[]> {
  try {
    const data = await fetchFromApi('/api/exam-patterns/featured/list') as ExamPattern[];
    return data || [];
  } catch (error) {
    console.error('Error fetching featured exams:', error);
    return [];
  }
}

async function getFilterOptions(): Promise<{ examLevels: string[] }> {
  try {
    const data = await fetchFromApi('/api/exam-patterns/meta/filters') as { examLevels?: string[] };
    return { examLevels: data.examLevels || [] };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return { examLevels: [] };
  }
}

function filterExamPatterns(examPatterns: ExamPattern[], search?: string, exam_level?: string): ExamPattern[] {
  let filtered = [...examPatterns];

  if (search) {
    const searchTerm = search.toLowerCase();
    filtered = filtered.filter(exam => 
      exam.exam_name.toLowerCase().includes(searchTerm) ||
      exam.exam_level.toLowerCase().includes(searchTerm) ||
      exam.exam_mode.toLowerCase().includes(searchTerm) ||
      (exam.description && exam.description.toLowerCase().includes(searchTerm))
    );
  }

  if (exam_level) {
    filtered = filtered.filter(exam => exam.exam_level === exam_level);
  }

  return filtered.slice(0, 12);
}

export default async function ExamPatterns({ searchParams }: ExamPatternsPageProps) {
  const { search, exam_level } = await searchParams;

  let allExamPatterns: ExamPattern[] = [];
  let featuredExams: ExamPattern[] = [];
  let filterOptions: { examLevels: string[] } = { examLevels: [] };
  let stats = { totalExams: 0, featuredCount: 0 };
  let error: string | null = null;

  try {
    const [examData, featuredData, filterData] = await Promise.all([
      getAllExamPatterns(),
      getFeaturedExams(),
      getFilterOptions()
    ]);
    allExamPatterns = examData.examPatterns;
    stats.totalExams = examData.total;
    featuredExams = featuredData;
    stats.featuredCount = featuredData.length;
    filterOptions = filterData;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load exam patterns';
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
            href="/exam-patterns"
            className="bg-[#C0A063] text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 text-lg shadow-md hover:shadow-xl inline-block"
            aria-label="Try loading exam patterns again"
          >
            Try Again
          </Link>
        </main>
      </div>
    );
  }

  const examPatterns = filterExamPatterns(allExamPatterns, search, exam_level);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 bg-[#FEF3E2] text-[#C0A063]">
              <span>Exam Patterns</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Exam Patterns & <span className="text-[#C0A063]">Syllabus</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              Comprehensive guide for SSC, RRB, Banking, UPSC and other competitive exams. Get detailed exam patterns, marking schemes, and syllabus information.
            </p>
            
            {/* Search and Filter */}
            <SearchForm search={search} examLevels={filterOptions.examLevels} selectedLevel={exam_level} />
          </div>
        </div>
      </section>

      {/* Featured Exams */}
      {featuredExams.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-[#192A41]">
                  Featured Exams
                </h2>
                <p className="text-sm text-gray-700">
                  {featuredExams.length} {featuredExams.length === 1 ? 'exam' : 'exams'} available
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {featuredExams.map((exam) => (
                <Link
                  key={exam._id}
                  href={`/exam-patterns/${exam.slug}`}
                  className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 hover:border-[#C0A063] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] block"
                  aria-label={`View exam pattern for ${exam.exam_name}`}
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C0A063]" />
                  
                  <div className="p-6 flex flex-col flex-grow min-h-[160px]">
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 text-[#192A41] leading-tight">
                      {exam.exam_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-auto">
                      {exam.exam_level} • {exam.exam_mode}
                    </p>

                    {/* Footer - Always at bottom */}
                    <div className="mt-3 pt-4 border-t border-gray-200">
                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#C0A063]">
                          View Details
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

      {/* All Exam Patterns */}
      <section id="results-section" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-[#192A41]">
                All Exam Patterns
              </h2>
              <p className="text-sm text-gray-700">
                {examPatterns.length} {examPatterns.length === 1 ? 'exam' : 'exams'} available
              </p>
            </div>
          </div>
          
          {examPatterns.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#192A41]">No Exam Patterns Found</h3>
              <p className="text-sm text-gray-800">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {examPatterns.map((exam) => (
                <Link
                  key={exam._id}
                  href={`/exam-patterns/${exam.slug}`}
                  className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 hover:border-[#C0A063] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] block"
                  aria-label={`View exam pattern for ${exam.exam_name}`}
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C0A063]" />
                  
                  <div className="p-6 flex flex-col flex-grow min-h-[160px]">
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 text-[#192A41] leading-tight">
                      {exam.exam_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-auto">
                      {exam.exam_level} • {exam.exam_mode}
                    </p>

                    {/* Footer - Always at bottom */}
                    <div className="mt-3 pt-4 border-t border-gray-200">
                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#C0A063]">
                          View Details
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


