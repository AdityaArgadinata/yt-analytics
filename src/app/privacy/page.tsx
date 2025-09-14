import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - YouTube Analytics Tool',
  description: 'Privacy Policy for YouTube Analytics Tool - How we collect, use, and protect your data',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                This Privacy Policy explains how YouTube Analytics Tool (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, 
                uses, and protects information when you use our service. We are committed to protecting 
                your privacy and ensuring transparency about our data practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 YouTube Data</h3>
              <p className="text-gray-700 mb-4">
                When you analyze a YouTube channel, we collect publicly available data from YouTube&apos;s API, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Channel information (name, description, subscriber count, view count)</li>
                <li>Video metadata (titles, descriptions, upload dates, view counts, like counts)</li>
                <li>Public statistics and performance metrics</li>
                <li>Video thumbnails and channel profile pictures</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Usage Data</h3>
              <p className="text-gray-700 mb-4">
                We may collect information about how you use our service, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our service</li>
                <li>Referring website information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Information</h2>
              <p className="text-gray-700 mb-4">We use the collected information to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide YouTube analytics and insights</li>
                <li>Generate keyword analysis and recommendations</li>
                <li>Display channel performance metrics</li>
                <li>Improve our service functionality and user experience</li>
                <li>Ensure compliance with YouTube&apos;s Terms of Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Data is processed in real-time and not permanently stored on our servers</li>
                <li>We use HTTPS encryption for all data transmission</li>
                <li>Access to YouTube data is limited to what&apos;s necessary for analytics</li>
                <li>We do not store personal user accounts or login credentials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">5.1 YouTube API</h3>
              <p className="text-gray-700 mb-4">
                Our service uses YouTube&apos;s Data API v3 to retrieve publicly available YouTube data. 
                Your use of our service is also governed by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><a href="https://www.youtube.com/t/terms" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a></li>
                <li><a href="https://policies.google.com/privacy" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">5.2 Analytics Services</h3>
              <p className="text-gray-700 mb-4">
                We may use third-party analytics services to understand how our service is used. 
                These services may collect information sent by your browser as part of a web page request.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your information to third parties, except:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>When required by law or legal process</li>
                <li>To protect our rights, property, or safety</li>
                <li>With your explicit consent</li>
                <li>To trusted service providers who assist us in operating our service (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Access information about what data we collect</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (where applicable)</li>
                <li>Object to processing of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Fair Use and Legal Compliance</h2>
              <p className="text-gray-700 mb-4">
                Our service operates under fair use principles:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>We only access publicly available YouTube data</li>
                <li>Data is used for analytical and educational purposes</li>
                <li>We comply with YouTube&apos;s API Terms of Service</li>
                <li>We respect intellectual property rights</li>
                <li>Our service is non-commercial and educational in nature</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If we become aware that we have 
                collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; 
                date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> aditdevelop@gmail.com<br />
                  <strong>Subject:</strong> Privacy Policy Inquiry
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                This tool is provided &quot;as is&quot; for educational and analytical purposes. We are not 
                affiliated with YouTube or Google. All YouTube trademarks and logos are the property 
                of Google LLC. Use of this tool is at your own risk and discretion.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}