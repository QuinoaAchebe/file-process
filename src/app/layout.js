import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Github } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Invoice Analyzer",
  description: "Intelligent invoice processing powered by Claude AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-slate-50 to-white min-h-screen`}
      >
        <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  InvoiceAI
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/QuinoaAchebe/file-process"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
          <footer className="mt-20 py-8 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                Powered by Claude AI • Built with Next.js
              </p>
            </div>
          </footer>
        </main>
      </body>
    </html>
  );
}