import React from 'react';
import Link from 'next/link';
import { fetchFromApi } from '../../../../utils/serverApi';
import { formatDisplayText } from '../../../../utils/textUtils';
import FloatingNotes from '../../../../components/FloatingNotes';
import QuestionsClient from './QuestionsClient';
 

interface Question {
  _id: string;
  question: string;
  answer: string;
  explanation?: string;
  question_image_url?: string;
}

interface Option {
  _id: string;
  option_text: string;
  option_type: string;
  path_url?: string;
}

interface QuestionItem {
  question: Question;
  options: Option[];
}

interface SubTopicQuestionsPageProps {
  params: Promise<{ topicName: string; subTopicName: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getQuestions(subTopicName: string): Promise<QuestionItem[]> {
  try {
    const data = await fetchFromApi(`/api/questions/subtopic/${encodeURIComponent(subTopicName)}`) as QuestionItem[];
    return data || [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to load questions. Please try again later.');
  }
}

export default async function SubTopicQuestions({ params, searchParams }: SubTopicQuestionsPageProps) {
  const { topicName, subTopicName } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const questionsPerPage = 10;
  
  let questions: QuestionItem[] = [];
  let error: string | null = null;

  try {
    questions = await getQuestions(subTopicName);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load questions. Please try again later.';
  }

  const displayTopicName = formatDisplayText(topicName);
  const displaySubTopicName = formatDisplayText(subTopicName);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex justify-center items-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-2xl font-bold text-[#192A41] mb-3">Error Loading Questions</h1>
            <p className="text-lg text-red-500 mb-6">{error}</p>
            <Link
              href={`/practice/${topicName}/${subTopicName}`}
              className="bg-[#C0A063] text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 text-lg shadow-md hover:shadow-xl inline-block"
              aria-label="Try loading questions again"
            >
              Try Again
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-4">
          <nav className="mb-4 text-sm text-gray-500 mt-5">
            <Link href="/practice" className="hover:text-[#C0A063] cursor-pointer" aria-label="Go to practice topics">
              Practice
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href={`/practice/${topicName}`} className="hover:text-[#C0A063] cursor-pointer" aria-label={`Go to ${displayTopicName} topic`}>
              {displayTopicName}
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-[#192A41] font-medium">{displaySubTopicName}</span>
          </nav>
          
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#192A41] mb-2">
              {displaySubTopicName} Practice Questions with Detailed and AI Explanations
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Improve your understanding of {displaySubTopicName} with comprehensive practice questions, clear explanations, and AI-powered guidance from {displayTopicName}.
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-auto shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-[#192A41] mb-2">No Questions Available</h2>
              <p className="text-gray-600">No questions available for this subtopic.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-4">
        <div className="hidden md:block">
          <FloatingNotes />
        </div>
        
        <nav className="mb-4 text-sm text-gray-500 mt-5">
          <Link href="/practice" className="hover:text-[#C0A063] cursor-pointer" aria-label="Go to practice topics">
            Practice
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href={`/practice/${topicName}`} className="hover:text-[#C0A063] cursor-pointer" aria-label={`Go to ${displayTopicName} topic`}>
            {displayTopicName}
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-[#192A41] font-medium">{displaySubTopicName}</span>
        </nav>
        
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#192A41] mb-2">
            {displaySubTopicName} Practice Questions with Detailed and AI Explanations
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Improve your understanding of {displaySubTopicName} with comprehensive practice questions, clear explanations, and AI-powered guidance from {displayTopicName}.
          </p>
        </div>
        
        <QuestionsClient 
          questions={questions} 
          apiUrl={API_URL} 
          topicName={topicName}
          subTopicName={subTopicName}
          currentPage={currentPage}
          questionsPerPage={questionsPerPage}
        />
      </main>
    </div>
  );
}

