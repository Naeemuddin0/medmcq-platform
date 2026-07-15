import "./globals.css";
import { Inter, Lora } from 'next/font/google';
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import AuthProvider from "../components/AuthProvider";

const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const display = Lora({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <head>
        <title>MedMCQ</title>
        <meta name="description" content="A focused practice platform for medical MCQs, built to track your progress subject by subject." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink dark:bg-[#10141a] dark:text-white">
        <AuthProvider>
          <Navigation />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
