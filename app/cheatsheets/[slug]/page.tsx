import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchFromApi } from '../../../utils/serverApi';
import CheatsheetClient from './CheatsheetClient';

interface CheatsheetItem {
  _id?: string;
  title: string;
  description?: string;
  category?: string;
  content_type: 'code' | 'text' | 'mixed';
  code?: string;
  language?: string;
  text_content?: string;
  mixed_content?: Array<{
    type: 'code' | 'text';
    content: string;
    language?: string;
  }>;
  order?: number;
}

interface Cheatsheet {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  tags?: string[];
  color?: string;
  featured?: boolean;
  views?: number;
  items?: CheatsheetItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface CheatsheetDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getCheatsheet(slug: string): Promise<Cheatsheet | null> {
  try {
    const data = await fetchFromApi(`/api/cheatsheets/slug/${encodeURIComponent(slug)}`) as Cheatsheet;
    return data || null;
  } catch (error) {
    console.error('Error fetching cheatsheet:', error);
    return null;
  }
}

export default async function CheatsheetDetail({ params }: CheatsheetDetailPageProps) {
  const { slug } = await params;
  
  let cheatsheet: Cheatsheet | null = null;
  let error: string | null = null;

  try {
    cheatsheet = await getCheatsheet(slug);
    if (!cheatsheet) {
      error = 'Cheatsheet not found';
    }
  } catch (err) {
    error = 'Failed to load cheatsheet';
  }

  if (error || !cheatsheet) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <main className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-full p-4 inline-block mb-6">
            <h1 className="text-2xl font-bold text-[#192A41] mb-3">Cheatsheet Not Found</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">The cheatsheet you're looking for doesn't exist.</p>
            <Link
              href="/cheatsheets"
              className="inline-block bg-[#C0A063] text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 text-lg shadow-md hover:shadow-xl"
              aria-label="Go back to cheatsheets list"
            >
              Back to Cheatsheets
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const items = cheatsheet.items && cheatsheet.items.length > 0 
    ? cheatsheet.items.sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  const itemCategories = items.length > 0 
    ? ['all', ...new Set(items.map(item => item.category).filter(Boolean) as string[])]
    : ['all'];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8 mt-16 print:[&_.no-print]:hidden [&_.prose-custom]:leading-[1.7] [&_.prose-custom]:text-gray-900 [&_.prose-custom_h1]:text-2xl [&_.prose-custom_h1]:font-bold [&_.prose-custom_h1]:my-6 [&_.prose-custom_h1]:mt-6 [&_.prose-custom_h1]:mb-3 [&_.prose-custom_h1]:text-gray-900 [&_.prose-custom_h2]:text-xl [&_.prose-custom_h2]:font-bold [&_.prose-custom_h2]:my-5 [&_.prose-custom_h2]:mt-5 [&_.prose-custom_h2]:mb-2 [&_.prose-custom_h2]:text-gray-900 [&_.prose-custom_h3]:text-lg [&_.prose-custom_h3]:font-semibold [&_.prose-custom_h3]:my-4 [&_.prose-custom_h3]:mt-4 [&_.prose-custom_h3]:mb-2 [&_.prose-custom_h3]:text-gray-900 [&_.prose-custom_p]:my-3 [&_.prose-custom_p]:text-gray-900 [&_.prose-custom_p]:bg-yellow-100 [&_.prose-custom_p]:py-2 [&_.prose-custom_p]:px-3 [&_.prose-custom_p]:rounded [&_.prose-custom_p]:border-l-2 [&_.prose-custom_p]:border-amber-500 [&_.prose-custom_code]:bg-gray-100 [&_.prose-custom_code]:px-1.5 [&_.prose-custom_code]:py-0.5 [&_.prose-custom_code]:rounded [&_.prose-custom_code]:font-mono [&_.prose-custom_code]:text-sm [&_.prose-custom_code]:text-red-500 [&_.prose-custom_pre]:bg-gray-50 [&_.prose-custom_pre]:border [&_.prose-custom_pre]:border-gray-200 [&_.prose-custom_pre]:p-4 [&_.prose-custom_pre]:rounded-md [&_.prose-custom_pre]:overflow-x-auto [&_.prose-custom_pre]:my-4 [&_.prose-custom_pre_code]:bg-transparent [&_.prose-custom_pre_code]:text-gray-900 [&_.prose-custom_pre_code]:p-0 [&_.prose-custom_ul]:my-3 [&_.prose-custom_ul]:pl-6 [&_.prose-custom_ul]:text-gray-900 [&_.prose-custom_ol]:my-3 [&_.prose-custom_ol]:pl-6 [&_.prose-custom_ol]:text-gray-900 [&_.prose-custom_li]:my-1.5 [&_.prose-custom_li]:text-gray-900 [&_.prose-custom_a]:text-blue-600 [&_.prose-custom_a]:underline [&_.prose-custom_strong]:font-semibold [&_.prose-custom_strong]:text-gray-900 [&_.prose-custom_div]:text-gray-900 [&_.prose-custom_span]:text-gray-900">
        {/* Header */}
        <div className="no-print mb-6 print:hidden">
          <Link
            href="/cheatsheets"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4 transition-colors"
            aria-label="Back to cheatsheets list"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>
        </div>

        {/* Title Section */}
        <div className="border-b-4 border-gray-900 pb-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {cheatsheet.title}
              </h1>
              {cheatsheet.description && (
                <p className="text-gray-600 text-lg mt-3 leading-relaxed">
                  {cheatsheet.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="px-3 py-1 bg-gray-100 rounded">
                  {cheatsheet.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        <CheatsheetClient items={items} itemCategories={itemCategories} />
      </div>
    </div>
  );
}

