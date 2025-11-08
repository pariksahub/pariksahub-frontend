import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { fetchFromApi } from '../../../utils/serverApi';
import FAQClient from './FAQClient';
import ScrollToTopButton from '../../../components/ScrollToTopButton';

interface Question {
  _id?: string;
  question: string;
  answer: string;
  order?: number;
}

interface FAQ {
  _id: string;
  topic_title: string;
  slug: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  views?: number;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

interface FAQDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getFAQ(slug: string): Promise<FAQ | null> {
  try {
    const data = await fetchFromApi(`/api/faqs/slug/${encodeURIComponent(slug)}`) as FAQ;
    return data || null;
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return null;
  }
}

export default async function FAQDetail({ params }: FAQDetailPageProps) {
  const { slug } = await params;
  
  let faq: FAQ | null = null;
  let error: string | null = null;

  try {
    faq = await getFAQ(slug);
    if (!faq) {
      error = 'FAQ not found';
    }
  } catch (err) {
    error = 'Failed to load FAQ';
  }

  if (error || !faq) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <main className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-full p-4 inline-block mb-6">
            <HelpCircle className="h-12 w-12 text-red-500" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-[#192A41] mb-3">FAQ Not Found</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">The FAQ you're looking for doesn't exist.</p>
          <Link
            href="/faqs"
            className="inline-block bg-[#C0A063] text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 text-lg shadow-md hover:shadow-xl"
            aria-label="Back to FAQs"
          >
            Back to FAQs
          </Link>
        </main>
      </div>
    );
  }

  // Sort questions by order
  const questions = faq.questions && faq.questions.length > 0 
    ? faq.questions.sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-6">
          <nav aria-label="Breadcrumb navigation">
            <Link
              href="/faqs"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4 transition-colors"
              aria-label="Back to FAQs"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to FAQs
            </Link>
          </nav>
        </div>

        {/* Title Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3E2] flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-[#C0A063]" aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#192A41] mb-3">
                {faq.topic_title}
              </h1>
              {faq.description && (
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                  {faq.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                {faq.featured && (
                  <span className="px-3 py-1 bg-[#FEF3E2] text-[#C0A063] rounded-full font-medium">
                    Featured
                  </span>
                )}
                {faq.views && faq.views > 0 && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    {faq.views} views
                  </span>
                )}
                {questions.length > 0 && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    {questions.length} {questions.length === 1 ? 'question' : 'questions'}
                  </span>
                )}
              </div>
              {faq.tags && faq.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {faq.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-md font-medium bg-gray-100 text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Questions */}
        {questions.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#192A41] mb-6">
              Questions & Answers
            </h2>
            <FAQClient questions={questions} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" aria-hidden="true" />
            <p className="text-gray-600">No questions available yet.</p>
          </div>
        )}

        {/* Back to FAQs */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/faqs"
            className="inline-flex items-center gap-2 text-[#C0A063] hover:text-[#192A41] font-medium transition-colors"
            aria-label="View all FAQs"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            View All FAQs
          </Link>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

