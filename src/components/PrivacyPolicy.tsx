import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "27 June 2026";

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <section className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-xl">
              <Shield className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-3">Privacy Policy</h1>
          <p className="text-purple-200">IQ200 National Prep Academy · Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto prose prose-lg text-gray-700 space-y-10">

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to IQ200 National Prep Academy ("IQ200", "we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at <strong>www.iq200olympiad.org</strong>.
            </p>
            <p>
              By using our website, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and class level when you register or sign in.</li>
              <li><strong>Usage Data:</strong> Quiz attempts, scores, time spent, and performance data to improve your learning experience.</li>
              <li><strong>Device Information:</strong> Browser type, device type, IP address, and operating system for analytics and security.</li>
              <li><strong>Cookies:</strong> We use cookies to maintain your session and improve website functionality.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To create and manage your account and learning profile</li>
              <li>To generate personalized quiz sessions and track your progress</li>
              <li>To issue verified digital certificates for your achievements</li>
              <li>To maintain national leaderboards and XP rankings</li>
              <li>To send important updates about the platform (no spam)</li>
              <li>To improve our AI quiz engine and content quality</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Google Analytics</h2>
            <p>
              We use Google Analytics to understand how visitors use our website. Google Analytics collects data such as pages visited, time spent, and device type. This data is anonymized and used only to improve our platform. You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" className="text-purple-700 underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Google AdSense</h2>
            <p>
              We may display advertisements through Google AdSense. Google uses cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-purple-700 underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share data only in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With service providers who help us operate the platform (e.g., Google Analytics, Vercel hosting)</li>
              <li>When required by law or to protect the rights of IQ200 and its users</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Children's Privacy</h2>
            <p>
              IQ200 is designed for students including children under 13. We do not knowingly collect sensitive personal information from children. We collect only the minimum information needed (name, email, class level) to provide the learning service. Parents or guardians may contact us at any time to review or delete their child's data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. Our website uses HTTPS encryption. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <strong>support@iq200olympiad.org</strong></p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date. We encourage you to review this policy periodically.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="bg-gray-50 rounded-xl p-4 mt-3">
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
