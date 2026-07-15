/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'Arial', 'Helvetica', 'sans-serif'],
        serif: ['var(--font-display)', 'Georgia', 'serif'],
      },
      colors: {
        paper: {
          DEFAULT: '#faf9f6',
          dim: '#f2f0ea',
        },
        ink: {
          DEFAULT: '#161a1f',
          muted: '#565f6b',
          faint: '#8a92a0',
        },
        line: {
          DEFAULT: '#e3e0d8',
        },
        accent: {
          DEFAULT: '#0f6657',
          soft: '#e4efe9',
          dim: '#0b4d42',
        },
        subject: {
          anatomy: '#2f6690',
          physiology: '#3a7d5c',
          biochemistry: '#a5750c',
          pathology: '#b0473f',
          microbiology: '#6b4c9a',
          pharmacology: '#a24b73',
        },
      },
      maxWidth: {
        page: '72rem',
      },
    },
  },
  plugins: [],
}
