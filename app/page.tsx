'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BookOpen, Target, TrendingUp, Check } from 'lucide-react';
import JsonLdSchema from '../components/JsonLdSchema';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pariksahub.com';

const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'PariksaHub | Competitive Exam Preparation',
  description: 'PariksaHub offers free competitive exam preparation resources, mock quizzes, and topic-wise guides for SSC, RRB, banking, campus placements, and more.',
  url: baseUrl,
  mainEntity: {
    '@type': 'EducationalOrganization',
    name: 'PariksaHub',
    description: 'Free platform for competitive exam preparation',
  },
};

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getMouseTransform = (intensity: number) => ({
    transform: `translate(${mousePosition.x * intensity}px, ${mousePosition.y * intensity}px)`,
    transition: 'transform 0.3s ease-out',
  });
  return (
    <>
      <JsonLdSchema schema={homePageSchema} id="home-schema" />
      <div className="min-h-screen bg-[#0A0E27] text-white">

        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99, 102, 241) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>

          {/* Gradient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#6366F1] to-transparent rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[#EC4899] to-transparent rounded-full blur-[120px] opacity-15"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left order-2 lg:order-1 relative z-20">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-[1.05] tracking-tight relative z-10">
                  <span className="block text-white">Prepare for</span>
                  <span className="block bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] text-transparent bg-clip-text pb-2">Competitive Exams</span>
                  <span className="block text-white">with Confidence</span>
                </h1>


                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-10">
                  <Link
                    href="/practice"
                    className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#6366F1]/50 transition-all inline-flex items-center justify-center group"
                    aria-label="Start practicing free competitive exam questions"

                  >
                    Start Practicing
                    <ArrowUpRight className="ml-2 w-5 h-5 group-hover:rotate-45 transition-transform" aria-hidden="true" />
                  </Link>


                </div>
              </div>

              {/* Right Image */}
              <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
                <div className="relative">
                  {/* Animated rings - smaller on mobile to avoid overlapping heading */}
                  <div
                    className="absolute inset-0 -m-4 lg:-m-8 rounded-full border-2 border-[#6366F1] border-opacity-20"
                    style={getMouseTransform(15)}
                  ></div>
                  <div
                    className="absolute inset-0 -m-8 lg:-m-16 rounded-full border-2 border-[#8B5CF6] border-opacity-10"
                    style={getMouseTransform(20)}
                  ></div>

                  <div
                    className="absolute -inset-6 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#EC4899] opacity-20 rounded-full blur-3xl"
                    style={getMouseTransform(10)}
                  ></div>
                  <div style={getMouseTransform(25)}>
                    <Image
                      alt="PariksaHub mascot owl"
                      className="w-64 sm:w-80 lg:w-96 rounded-2xl relative z-10 shadow-2xl"
                      src="/assets/PariksaHub.png"
                      width={384}
                      height={384}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gradient-to-b from-[#0A0E27] to-[#1a1f3a] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
                <span className="text-white">Everything You Need to </span>
                <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">Top Competitive Exams</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group bg-[#161B33] border border-gray-800 p-6 rounded-2xl hover:border-[#6366F1] hover:shadow-xl hover:shadow-[#6366F1]/20 hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6366F1]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <h3 className="text-xl font-bold text-white mb-3">
                  Comprehensive Library
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  A wide range of practice questions that cover all major competitive exam topics and question patterns.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-[#161B33] border border-gray-800 p-6 rounded-2xl hover:border-[#6366F1] hover:shadow-xl hover:shadow-[#6366F1]/20 hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>


                <h3 className="text-xl font-bold text-white mb-3">
                  Real-time Testing
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Take mock tests that feel like the real exam and get instant, detailed performance insights.                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-[#161B33] border border-gray-800 p-6 rounded-2xl hover:border-[#6366F1] hover:shadow-xl hover:shadow-[#6366F1]/20 hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EC4899]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <h3 className="text-xl font-bold text-white mb-3">
                  Targeted Practice
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Practice specific topics and improve your weak areas with our smart, topic-wise question system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 bg-[#0A0E27] relative">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99, 102, 241) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="bg-gradient-to-br from-[#161B33] to-[#1a1f3a] border border-gray-800 rounded-2xl p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="inline-block mb-3 px-4 py-1.5 bg-[#6366F1] bg-opacity-10 backdrop-blur-sm border border-[#6366F1] border-opacity-30 rounded-full">
                  <span className="text-xs font-bold text-white tracking-wider uppercase">Our Story</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">Why PariksaHub?</span>
                </h2>
              </div>

              <div className="text-gray-400 space-y-4 leading-relaxed text-base">
                <p>PariksaHub is made to help you prepare for competitive exams without confusion. Instead of using many PDFs and old notes, you get everything in one place. You can visit our website, follow a clear study flow, and practice questions in the same way exams might actually be asked.</p>

                <p>The practice tests and mock quizzes cover topics like quantitative aptitude, reasoning, computer basics, and more. You can choose a topic, practice questions, see simple explanations, and go back to the areas where you make mistakes. The system keeps track of your progress so you know what to work on next.</p>

                <p>You can use PariksaHub to prepare for SSC CGL, RRB, banking exams, or placements by practicing questions, checking explanations, and improving weak areas.</p>              </div>
            </div>
          </div>
        </section>

        {/* Popular Topics Section */}
        <section className="py-12 bg-gradient-to-b from-[#1a1f3a] to-[#0A0E27]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-block mb-3 px-4 py-1.5 bg-[#6366F1] bg-opacity-10 backdrop-blur-sm border border-[#6366F1] border-opacity-30 rounded-full">
                <span className="text-xs font-bold text-white tracking-wider uppercase">Start Here</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3">
                <span className="text-white">Popular </span>
                <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">Practice Areas</span>
              </h2>
              <p className="text-base text-gray-400 max-w-2xl mx-auto">
                Master the core subjects that matter most
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Topic 1 */}
              <Link href="/practice/general-aptitude" className="group relative bg-[#161B33] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col border border-gray-800 hover:border-[#6366F1] hover:shadow-xl hover:shadow-[#6366F1]/20 min-h-[200px]" aria-label="Start practicing aptitude questions">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative p-6 flex flex-col flex-grow">
                  <div className="absolute top-4 right-4 text-5xl font-black text-white opacity-5 group-hover:opacity-10 transition-opacity">
                    01
                  </div>

                  <h3 className="text-xl font-bold mb-2 relative z-10">
                    Aptitude
                  </h3>

                  <p className="text-gray-400 mb-4 flex-grow text-sm">
                    Quantitative reasoning, data interpretation, and logical problem solving
                  </p>

                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-sm font-bold text-[#6366F1] group-hover:text-[#8B5CF6] transition-colors">
                      Start Practice
                    </span>
                    <div className="w-10 h-10 bg-[#6366F1] group-hover:bg-gradient-to-br group-hover:from-[#6366F1] group-hover:to-[#8B5CF6] flex items-center justify-center transition-all duration-300 group-hover:rotate-45 rounded-lg">
                      <ArrowUpRight className="w-5 h-5 text-white transition-all duration-300" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Topic 2 */}
              <Link href="/practice/logical-reasoning" className="group relative bg-[#161B33] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col border border-gray-800 hover:border-[#6366F1] hover:shadow-xl hover:shadow-[#6366F1]/20 min-h-[200px]" aria-label="Start practicing reasoning questions">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative p-6 flex flex-col flex-grow">
                  <div className="absolute top-4 right-4 text-5xl font-black text-white opacity-5 group-hover:opacity-10 transition-opacity">
                    02
                  </div>

                  <h3 className="text-xl font-bold mb-2 relative z-10">
                    Reasoning
                  </h3>

                  <p className="text-gray-400 mb-4 flex-grow text-sm">
                    Logical reasoning, verbal reasoning, and analytical thinking skills
                  </p>

                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-sm font-bold text-[#6366F1] group-hover:text-[#8B5CF6] transition-colors">
                      Start Practice
                    </span>
                    <div className="w-10 h-10 bg-[#6366F1] group-hover:bg-gradient-to-br group-hover:from-[#6366F1] group-hover:to-[#8B5CF6] flex items-center justify-center transition-all duration-300 group-hover:rotate-45 rounded-lg">
                      <ArrowUpRight className="w-5 h-5 text-white transition-all duration-300" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Topic 3 */}
              <Link href="/practice/computer-science" className="group relative bg-[#161B33] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col border border-gray-800 hover:border-[#6366F1] hover:shadow-xl hover:shadow-[#6366F1]/20 min-h-[200px]" aria-label="Start practicing computer science questions">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative p-6 flex flex-col flex-grow">
                  <div className="absolute top-4 right-4 text-5xl font-black text-white opacity-5 group-hover:opacity-10 transition-opacity">
                    03
                  </div>

                  <h3 className="text-xl font-bold mb-2 relative z-10">
                    Computer Science
                  </h3>

                  <p className="text-gray-400 mb-4 flex-grow text-sm">
                    Core CS principles including OS, Compiler Design, DBMS, and algorithms
                  </p>

                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-sm font-bold text-[#6366F1] group-hover:text-[#8B5CF6] transition-colors">
                      Start Practice
                    </span>
                    <div className="w-10 h-10 bg-[#6366F1] group-hover:bg-gradient-to-br group-hover:from-[#6366F1] group-hover:to-[#8B5CF6] flex items-center justify-center transition-all duration-300 group-hover:rotate-45 rounded-lg">
                      <ArrowUpRight className="w-5 h-5 text-white transition-all duration-300" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-[#0A0E27]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#161B33] to-[#1a1f3a] border border-gray-800 rounded-2xl p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-black mb-3">
                  <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">What You Get</span>
                </h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="font-bold text-white text-lg mb-1">Free Access</div>
                  <div className="text-gray-400 text-sm">No hidden charges</div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-white text-lg mb-1">Expert Content</div>
                  <div className="text-gray-400 text-sm">Curated by professionals</div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-white text-lg mb-1">24/7 Available</div>
                  <div className="text-gray-400 text-sm">Practice anytime</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#EC4899] opacity-90"></div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight text-white">
              Ready to Start Your Exam Preparation Journey?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of successful candidates who chose PariksaHub to achieve their career goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/practice"
                className="bg-white text-[#6366F1] font-bold px-10 py-4 rounded-xl hover:bg-gray-100 transition-all inline-flex items-center justify-center group shadow-2xl"
                aria-label="Start your exam preparation journey"
              >
                Start Your Journey
                <ArrowUpRight className="ml-2 w-5 h-5 group-hover:rotate-45 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}