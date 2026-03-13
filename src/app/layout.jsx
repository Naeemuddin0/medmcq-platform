import "./globals.css";
import { Inter } from 'next/font/google';
import Navigation from "../components/Navigation";
import AuthProvider from "../components/AuthProvider";

const inter = Inter({ subsets: ['latin'] });

// Removed Metadata import and type, will handle as plain JS object if needed
// export const metadata: Metadata = {
//   title: 'MedMCQ',
//   description: 'AI-powered medical MCQ practice platform',
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <title>MedMCQ</title>
        <meta name="description" content="AI-powered medical MCQ practice platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
} 