import type { Metadata } from 'next';
import JsonLdSchema from '../../components/JsonLdSchema';

export const metadata: Metadata = {
  title: 'FAQs & Common Questions for Competitive Exams and Technical Interviews',
  description: 'Frequently asked questions about competitive exams, study resources, exam patterns, preparation strategies and more. Get answers to common queries.',
  keywords: [
    'FAQs',
    'frequently asked questions',
    'exam questions',
    'study help',
    'competitive exam FAQs',
    'exam preparation questions',
    'common questions',
    'exam guidance'
  ],
  openGraph: {
    title: 'FAQs & Common Questions for Competitive Exams and Technical Interviews',
    description: 'Frequently asked questions about competitive exams, study resources, exam patterns, and preparation strategies. Get answers to common queries.',
    url: '/faqs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQs & Common Questions for Competitive Exams and Technical Interviews',
    description: 'Frequently asked questions about competitive exams, study resources, exam patterns, and preparation strategies. Get answers to common queries.',
  },
  alternates: {
    canonical: '/faqs',
  },
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pariksahub.com';

const faqsSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'FAQs & Common Questions',
  description: 'Frequently asked questions about competitive exams, study resources, exam patterns, preparation strategies and more. Get answers to common queries.',
  url: `${baseUrl}/faqs`,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQs',
        item: `${baseUrl}/faqs`,
      },
    ],
  },
};

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdSchema schema={faqsSchema} id="faqs-schema" />
      {children}
    </>
  );
}

