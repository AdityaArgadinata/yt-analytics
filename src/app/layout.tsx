import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "YoutubePro - Advanced YouTube Analytics",
  description:
    "Professional YouTube analytics platform. Analyze channel performance, trending keywords, and content strategy with real-time data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en">
          <body className="bg-slate-50 min-h-screen flex flex-col">
            <AuthProvider>
              <div className="flex-1">
                {children}
              </div>
              <footer className="w-full border-t border-slate-200 bg-white py-6 mt-8">
                <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-slate-600 text-sm">
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                    <span>&copy; 2025 YoutubePro. All rights reserved.</span>
                    <div className="flex items-center gap-4">
                      <a 
                        href="/privacy" 
                        className="hover:text-slate-900 transition-colors underline"
                      >
                        Privacy Policy
                      </a>
                      <a 
                        href="/terms" 
                        className="hover:text-slate-900 transition-colors underline"
                      >
                        Terms of Service
                      </a>
                      <a 
                        href="https://www.youtube.com/t/terms" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-slate-900 transition-colors underline"
                      >
                        YouTube Terms
                      </a>
                    </div>
                  </div>
                  <span className="mt-2 md:mt-0">Made with <span className="text-red-500">&#10084;</span> for Fair Use Analytics</span>
                </div>
              </footer>
            </AuthProvider>
      </body>
    </html>
  );
}
