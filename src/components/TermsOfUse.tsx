import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfUse() {
  const lastUpdated = "27 June 2026";

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <section className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-xl">
              <FileText className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-3">Terms of Use</h1>
          <p className="text-purple-200">IQ200 National Prep Academy · Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto prose prose-lg text-gray-700 space-y-10">

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the IQ200 National Prep Academy website at <strong>www.iq200olympiad.org</strong>, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Use of the Platform</h2>
            <p>IQ200 is a free educational platform for Olympiad preparation. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform only for lawful, educational purposes</li>
              <li>Not share your account credentials with others</li>
              <li>Not attempt to reverse-engineer, copy, or reproduce our AI quiz content</li>
              <li>Not use bots, scripts, or automated tools to access the platform</li>
              <li>Provide accurate information when creating your profile</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Intellectual Property</h2>
            <p>
              All content on IQ200 — including questions, explanations, certificates, designs, logos, and AI-generated content — is the intellectual property of IQ200 National Prep Academy. You may not reproduce, distribute, or commercially exploit any content from this platform without prior written permission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Digital Certificates</h2>
            <p>
              Certificates issued by IQ200 are digital achievement records for practice performance on our platform. They are not official government or board certifications. They are intended to recognize student effort and encourage consistent practice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. AI-Generated Content</h2>
            <p>
              IQ200 uses Google Gemini AI to generate quiz questions. While we validate and quality-check all content, AI-generated questions may occasionally contain errors. We continuously improve our content quality. If you find an error, please report it to us at support@iq200olympiad.org.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Disclaimer of Warranties</h2>
            <p>
              IQ200 is provided "as is" without warranties of any kind. We do not guarantee that our platform will always be available, error-free, or that the content will be perfectly accurate. We are not responsible for any decisions made based on platform content.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p>
              IQ200 National Prep Academy shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the amount you paid us in the past 12 months (which is zero, as our platform is free).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to IQ200 at any time if you violate these Terms of Use or engage in any conduct that we deem harmful to the platform or its users.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Governing Law</h2>
            <p>
              These Terms of Use shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the platform after changes constitutes your acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Contact</h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <p><strong>IQ200 National Prep Academy</strong></p>
              <p>Email: support@iq200olympiad.org</p>
              <p>Website: www.iq200olympiad.org</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
