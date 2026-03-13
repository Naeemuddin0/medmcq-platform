import React from 'react';

const team = [
  {
    name: 'Naeem Ud Din',
    role: 'Full Stack Data Scientist',
    img: '/team-naeem.jpeg', 
  },
  
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/80 via-indigo-100/60 to-cyan-50/40 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900">
      <div className="max-w-3xl mx-auto">
        <div className="backdrop-blur-md bg-white/60 dark:bg-gradient-to-br dark:from-indigo-800/80 dark:via-blue-900/70 dark:to-cyan-900/80 rounded-3xl shadow-2xl p-10 border border-white/30 dark:border-white/10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-6 text-center drop-shadow">About Us</h1>
          <p className="mb-6 text-lg text-gray-700 dark:text-gray-200 text-center">
            <strong>MedMCQ Platform</strong> is an intelligent medical MCQ practice and progress tracking platform. Our mission is to help medical students and professionals prepare for exams and improve their knowledge using data-driven insights and modern web technology.
          </p>
          <p className="mb-10 text-gray-700 dark:text-gray-300 text-center">
            The platform leverages data science and analytics to provide personalized feedback, progress tracking, and preparation estimation for each user. We believe in making learning efficient, engaging, and measurable.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Team</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {team.map(member => (
              <div key={member.name} className="flex flex-col items-center bg-white/70 dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 w-64 border border-gray-200 dark:border-white/10">
                <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-4 border-blue-200 dark:border-purple-400 shadow-md">
                  <img src={member.img} alt={member.name} className="object-cover w-full h-full" />
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</div>
                <div className="text-blue-600 dark:text-blue-300 font-medium mb-2">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 