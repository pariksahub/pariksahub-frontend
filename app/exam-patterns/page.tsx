 
import React from 'react';
import Link from 'next/link';
import { AlertCircle, Star, Clock, BookOpen, Award, Check, X, ArrowRight } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
        <main className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-3 text-[#192A41]">Error Loading Data</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/exam-patterns"
            className="px-6 py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all inline-block"
            style={{ backgroundColor: '#C0A063' }}
          >
            Retry
          </a>
        </main>
      </div>
    );
  }

  const examPatterns = filterExamPatterns(allExamPatterns, search, exam_level);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24" style={{ backgroundColor: '#192A41' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              Exam Patterns & <span style={{ color: '#C0A063' }}>Syllabus</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 mb-6">
              Comprehensive guide for SSC, RRB, Banking, UPSC and other competitive exams
            </p>
            
            {/* Search Bar */}
            <SearchForm search={search} examLevels={filterOptions.examLevels} selectedLevel={exam_level} />

            {/* Stats */}
            <div className="flex justify-center gap-6 text-sm">
              <div>
                <span className="font-bold text-lg" style={{ color: '#C0A063' }}>{stats.totalExams}</span>
                <span className="text-gray-300 ml-1">Exams</span>
              </div>
              <div>
                <span className="font-bold text-lg" style={{ color: '#C0A063' }}>{stats.featuredCount}</span>
                <span className="text-gray-300 ml-1">Featured</span>
              </div>
              <div>
                <span className="font-bold text-lg" style={{ color: '#C0A063' }}>100%</span>
                <span className="text-gray-300 ml-1">Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Exams */}
      {featuredExams.length > 0 && (
        <section className="py-10 sm:py-14 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#192A41]">Featured Exams</h2>
              <div className="flex items-center gap-1 text-sm" style={{ color: '#C0A063' }}>
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold">Popular</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredExams.map((exam) => (
                <Link
                  key={exam._id}
                  href={`/exam-patterns/${exam.slug}`}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 text-[#192A41]">
                        {exam.exam_name}
                      </h3>
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: '#C0A063' }}>
                        {exam.exam_level}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#C0A063' }}>
                      <Star className="h-5 w-5 fill-current text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Questions</span>
                      </div>
                      <div className="text-xl font-bold text-[#192A41]">{exam.total_questions}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Duration</span>
                      </div>
                      <div className="text-xl font-bold text-[#192A41]">{exam.duration}m</div>
                    </div>
                  </div>

                  {exam.marking_scheme && (
                    <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#192A41' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-4 w-4 text-white" />
                        <span className="text-sm font-bold text-white">Marking Scheme</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-white font-semibold">+{exam.marking_scheme.correct_answer}</span>
                        </div>
                        {exam.marking_scheme.negative_marking && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                              <X className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-white font-semibold">-{exam.marking_scheme.negative_marking_value}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end text-sm pt-3 border-t border-gray-100">
                    <span className="font-semibold flex items-center gap-1" style={{ color: '#C0A063' }}>
                      View Details <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Exam Patterns */}
      <section id="results-section" className="py-10 sm:py-14 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#192A41]">All Exam Patterns</h2>
          
          {examPatterns.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#192A41' }}>
                <BookOpen className="h-8 w-8" style={{ color: '#C0A063' }} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-[#192A41]">No Exam Patterns Found</h3>
              <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {examPatterns.map((exam) => (
                <Link
                  key={exam._id}
                  href={`/exam-patterns/${exam.slug}`}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 text-[#192A41]">
                        {exam.exam_name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: '#C0A063' }}>
                          {exam.exam_level}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-[#192A41]">
                          {exam.exam_mode}
                        </span>
                      </div>
                    </div>
                    {exam.featured && (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#C0A063' }}>
                        <Star className="h-5 w-5 fill-current text-white" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Questions</span>
                      </div>
                      <div className="text-xl font-bold text-[#192A41]">{exam.total_questions}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Duration</span>
                      </div>
                      <div className="text-xl font-bold text-[#192A41]">{exam.duration}m</div>
                    </div>
                  </div>

                  {exam.marking_scheme && (
                    <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#192A41' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-4 w-4 text-white" />
                        <span className="text-sm font-bold text-white">Marking Scheme</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-white font-semibold">+{exam.marking_scheme.correct_answer}</span>
                        </div>
                        {exam.marking_scheme.negative_marking && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                              <X className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-white font-semibold">-{exam.marking_scheme.negative_marking_value}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end text-sm pt-3 border-t border-gray-100">
                    <span className="font-semibold flex items-center gap-1" style={{ color: '#C0A063' }}>
                      Details <ArrowRight className="h-4 w-4" />
                    </span>
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

