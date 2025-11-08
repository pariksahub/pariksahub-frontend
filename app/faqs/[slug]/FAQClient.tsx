'use client';

import React from 'react';

interface Question {
  _id?: string;
  question: string;
  answer: string;
  order?: number;
}

interface FAQClientProps {
  questions: Question[];
}

export default function FAQClient({ questions }: FAQClientProps) {
  return (
    <div className="space-y-6" role="list" aria-label="Frequently asked questions and answers">
      <style dangerouslySetInnerHTML={{
        __html: `
          .faq-content p {
            margin-bottom: 0.75rem;
            line-height: 1.6;
          }
          
          .faq-content ul {
            list-style-type: disc !important;
            margin: 0.75rem 0 !important;
            padding-left: 1.5rem !important;
          }
          
          .faq-content ol {
            list-style-type: decimal !important;
            margin: 0.75rem 0 !important;
            padding-left: 1.5rem !important;
          }
          
          .faq-content li {
            margin-bottom: 0.25rem !important;
            line-height: 1.6 !important;
            display: list-item !important;
          }
          
          .faq-content strong {
            font-weight: 600;
            color: #192A41;
          }
          
          .faq-content em {
            font-style: italic;
          }
          
          .faq-content u {
            text-decoration: underline;
          }
          
          .faq-content a {
            color: #C0A063;
            text-decoration: underline;
          }
          
          .faq-content h1,
          .faq-content h2,
          .faq-content h3 {
            font-weight: 700;
            color: #192A41;
            margin: 1rem 0 0.5rem 0;
          }
        `
      }} />
      
      {questions.map((q, index) => (
        <article
          key={q._id || index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8"
          aria-labelledby={`faq-question-${index}`}
          role="article"
        >
          <div className="mb-4">
            <h3 
              id={`faq-question-${index}`}
              className="text-lg sm:text-xl font-bold text-[#192A41] leading-snug"
            >
              <span 
                className="inline-flex items-center justify-center w-6 h-6 bg-[#C0A063] text-white font-bold text-sm rounded-full align-middle mr-3 md:mr-2"
                aria-label={`Question number ${index + 1}`}
              >
                {index + 1}
              </span>
              {q.question}
            </h3>
          </div>
          
          <div 
            className="md:ml-8"
            role="region"
            aria-label="Answer"
          >
            <div 
              className="faq-content text-gray-700"
              dangerouslySetInnerHTML={{ __html: q.answer }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

