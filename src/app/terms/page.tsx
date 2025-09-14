import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - YouTube Analytics Tool',
  description: 'Terms of Service for YouTube Analytics Tool - Rules and guidelines for using our service',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using YouTube Analytics Tool (&quot;Service&quot;), you accept and agree to be bound 
                by the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                YouTube Analytics Tool is an educational and analytical service that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Analyzes publicly available YouTube channel data</li>
                <li>Provides insights into video performance and engagement</li>
                <li>Generates keyword analysis and content recommendations</li>
                <li>Operates under fair use principles for educational purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Fair Use and Educational Purpose</h2>
              <p className="text-gray-700 mb-4">
                This service is provided strictly for educational and analytical purposes under fair use provisions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Analysis is limited to publicly available YouTube data</li>
                <li>No copyrighted content is reproduced or redistributed</li>
                <li>Data is used for transformative analytical purposes</li>
                <li>Service respects intellectual property rights</li>
                <li>Usage complies with YouTube&apos;s Terms of Service and API policies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">As a user of this service, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Use the service only for legitimate analytical and educational purposes</li>
                <li>Not attempt to circumvent any limitations or restrictions</li>
                <li>Respect the intellectual property rights of content creators</li>
                <li>Not use the service for commercial competitive intelligence without permission</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not abuse or overload our service infrastructure</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitations and Restrictions</h2>
              <p className="text-gray-700 mb-4">You may not:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Reproduce, distribute, or create derivative works from our service</li>
                <li>Use automated tools to access the service without permission</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Accuracy and Limitations</h2>
              <p className="text-gray-700 mb-4">
                While we strive to provide accurate analytics, please note:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Data is sourced from YouTube&apos;s public API and may have limitations</li>
                <li>Analytics are estimates and may not reflect exact metrics</li>
                <li>We are not responsible for data accuracy or completeness</li>
                <li>Results should be used as guidance, not absolute truth</li>
                <li>YouTube data policies may affect available information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The service and its original content, features, and functionality are and will remain 
                the exclusive property of YouTube Analytics Tool and its licensors. The service is 
                protected by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-700 mb-4">
                YouTube, the YouTube logo, and related marks are trademarks of Google LLC. 
                We are not affiliated with or endorsed by YouTube or Google.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We expressly disclaim 
                all warranties of any kind, whether express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Implied warranties of merchantability and fitness for a particular purpose</li>
                <li>Non-infringement of third-party rights</li>
                <li>Accuracy, completeness, or reliability of the service</li>
                <li>Uninterrupted or error-free operation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall YouTube Analytics Tool, its directors, employees, partners, agents, 
                suppliers, or affiliates be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your access immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-700 mb-4">
                Upon termination, your right to use the service will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which 
                the service operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any 
                new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> aditdevelop@gmail.com<br />
                  <strong>Subject:</strong> Terms of Service Inquiry
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}