import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Questions - Review Your Bookmarked Practice Questions',
  description: 'Review your saved and bookmarked practice questions. Access your collection of saved questions for competitive exam preparation.',
  keywords: [
    'saved questions',
    'bookmarked questions',
    'practice questions',
    'competitive exam',
    'review questions',
    'saved mcq',
  ],
  openGraph: {
    title: 'Saved Questions - Review Your Bookmarked Practice Questions',
    description: 'Review your saved and bookmarked practice questions. Access your collection of saved questions for competitive exam preparation.',
    url: '/saved',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saved Questions - Review Your Bookmarked Practice Questions',
    description: 'Review your saved and bookmarked practice questions. Access your collection of saved questions for competitive exam preparation.',
  },
  alternates: {
    canonical: '/saved',
  },
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

