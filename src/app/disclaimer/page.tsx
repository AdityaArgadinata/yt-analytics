import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - YouTube Analytics Tool',
  description: 'Legal disclaimer for YouTube Analytics Tool - Fair use and educational purpose statement',
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Disclaimer</h1>
          
          <div className="prose prose-gray max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Educational Fair Use Tool
              </h2>
              <p className="text-blue-800">
                This tool is designed exclusively for educational and analytical purposes under fair use provisions. 
                It analyzes publicly available data to provide insights for content creators and researchers.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Fair Use Statement</h2>
              <p className="text-gray-700 mb-4">
                This YouTube Analytics Tool operates under the doctrine of fair use as outlined in 
                Section 107 of the Copyright Act. Our use of YouTube data is:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Educational:</strong> Used for teaching, learning, and research purposes</li>
                <li><strong>Transformative:</strong> Creates new insights and analytics from existing data</li>
                <li><strong>Non-commercial:</strong> Provided freely for educational benefit</li>
                <li><strong>Limited in scope:</strong> Uses only publicly available metadata</li>
                <li><strong>Non-competitive:</strong> Does not compete with YouTube&apos;s services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Source and Usage</h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">What We Access</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Public channel information (name, description, subscriber count)</li>
                  <li>Public video metadata (titles, descriptions, view counts, upload dates)</li>
                  <li>Public engagement metrics (likes, comments count)</li>
                  <li>Public thumbnails and profile images</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">What We DON&apos;T Access</h3>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Private or unlisted videos</li>
                  <li>User personal information or contact details</li>
                  <li>Revenue or monetization data</li>
                  <li>Private analytics or dashboard data</li>
                  <li>Comments content or user interactions</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibant text-gray-900 mb-4">No Affiliation</h2>
              <p className="text-gray-700 mb-4">
                This tool is independently developed and is NOT affiliated with, endorsed by, or connected to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>YouTube LLC or Google LLC</li>
                <li>Any specific content creators or channels</li>
                <li>Any commercial analytics platforms</li>
                <li>Any social media management companies</li>
              </ul>
              <p className="text-gray-700 mb-4">
                YouTube and the YouTube logo are trademarks of Google LLC. All trademarks are 
                the property of their respective owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accuracy and Limitations</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-medium text-yellow-900 mb-3">⚠️ Important Notice</h3>
                <p className="text-yellow-800">
                  The analytics and insights provided by this tool are estimates based on publicly 
                  available data and should not be considered as exact or official metrics.
                </p>
              </div>
              
              <p className="text-gray-700 mb-4">Please note the following limitations:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Data accuracy depends on YouTube&apos;s API availability and policies</li>
                <li>Metrics may not reflect real-time changes</li>
                <li>Some data points may be approximated or unavailable</li>
                <li>Analysis algorithms are proprietary and educational in nature</li>
                <li>Results should be used for guidance and learning, not business decisions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Responsible Use</h2>
              <p className="text-gray-700 mb-4">
                Users of this tool are expected to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Respect content creators&apos; intellectual property rights</li>
                <li>Use insights for educational and self-improvement purposes</li>
                <li>Not harass or negatively target content creators based on analytics</li>
                <li>Understand that all content creators deserve respect regardless of metrics</li>
                <li>Follow YouTube&apos;s Community Guidelines and Terms of Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact for Concerns</h2>
              <p className="text-gray-700 mb-4">
                If you are a content creator and have concerns about your channel being analyzed, 
                or if you believe there are any issues with our fair use practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> fairuse@youtubeanalytics.tool<br />
                  <strong>Subject:</strong> Fair Use Inquiry or Content Concern<br />
                  <strong>Response Time:</strong> Within 48 hours
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates and Changes</h2>
              <p className="text-gray-700 mb-4">
                This disclaimer may be updated periodically to reflect changes in our practices 
                or legal requirements. Users are encouraged to review this page regularly.
              </p>
              <p className="text-gray-600 text-sm">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}