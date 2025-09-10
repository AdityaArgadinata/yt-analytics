import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube Channel Analytics",
  description:
    "Search any channel and see analytics from the latest 500 videos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en">
          <body className="bg-slate-50 min-h-screen flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <footer className="w-full border-t border-slate-200 bg-white py-6 mt-8">
              <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-slate-600 text-sm">
                <span>&copy; {new Date().getFullYear()} YT Analytics. All rights reserved.</span>
                <span className="mt-2 md:mt-0">Made with <span className="text-red-500">&#10084;</span> by Aditya Argadinata</span>
              </div>
            </footer>
      </body>
    </html>
  );
}
