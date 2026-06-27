import React from 'react';
import { Brain, Trophy, Users, Star, CheckCircle, Target, Zap, Globe } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-600 p-4 rounded-2xl">
              <Brain className="w-12 h-12 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            About <span className="text-yellow-400">IQ200</span> National Prep Academy
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            India's most advanced free Olympiad preparation platform — powered by AI, built for Class 2 to 10 students across the nation.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              Every year, millions of Indian students appear for competitive Olympiad exams — IMO, NSO, IEO, and more — with dreams of ranking in the top 100 nationally. Yet quality preparation material remains expensive, inaccessible, or outdated for most families.
            </p>
            <p>
              IQ200 was created to change that. We built a platform where every student — regardless of their city, school, or economic background — gets access to world-class Olympiad preparation, completely free.
            </p>
            <p>
              Our AI-powered quiz engine generates unlimited practice questions calibrated to each class level and subject. Students earn verified digital certificates, track their performance on national leaderboards, and get instant explanations for every answer — all without spending a single rupee.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">What Makes IQ200 Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 text-yellow-500" />,
                title: "AI-Powered Question Engine",
                desc: "Our Gemini AI generates fresh, curriculum-aligned questions for every session. No two tests are the same."
              },
              {
                icon: <Trophy className="w-6 h-6 text-yellow-500" />,
                title: "Verified Digital Certificates",
                desc: "Every student who scores 6/10 or above earns a Gold, Silver or Bronze certificate with a unique QR verification code."
              },
              {
                icon: <Target className="w-6 h-6 text-yellow-500" />,
                title: "Class 2 to Class 10 Coverage",
                desc: "Complete syllabus coverage for IMO, NSO, IEO, ITO and more — for every class level from 2 to 10."
              },
              {
                icon: <Globe className="w-6 h-6 text-yellow-500" />,
                title: "National Leaderboards",
                desc: "Students compete on live national, state, class and subject leaderboards — building healthy competition."
              },
              {
                icon: <Star className="w-6 h-6 text-yellow-500" />,
                title: "XP & Achievement System",
                desc: "Daily streaks, XP points, badges and level-ups keep students motivated to practice every day."
              },
              {
                icon: <Users className="w-6 h-6 text-yellow-500" />,
                title: "Friend Challenge Mode",
                desc: "Students can challenge their friends directly and compare scores — making preparation social and fun."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-50 p-2 rounded-lg">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Who We Serve</h2>
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            {[
              "Students from Class 2 to Class 10 preparing for IMO, NSO, IEO, ITO, SOF and other Olympiads",
              "Students in Tier 2 and Tier 3 cities who don't have access to expensive coaching",
              "Parents who want structured, curriculum-aligned practice for their children",
              "Schools looking for a free supplementary Olympiad preparation tool",
              "Students who want to practice daily and build a consistent study habit"
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-purple-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">IQ200 by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500,000+", label: "Students Trusted Us" },
              { number: "12,000+", label: "Top 100 Rankers" },
              { number: "9 Subjects", label: "Covered" },
              { number: "Class 2–10", label: "All Levels" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-black text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-purple-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to Start Preparing?</h2>
          <p className="text-gray-600 text-lg mb-8">Join thousands of students already practicing on IQ200. It's completely free.</p>
          <a
            href="/"
            className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Start Free Practice Now
          </a>
        </div>
      </section>

    </div>
  );
}
