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
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-[6px] shadow-sm p-10 border border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 text-center">About Us</h1>
          <p className="mb-6 text-lg text-gray-700 dark:text-gray-300 text-center font-medium">
            <strong>Medita</strong> is an intelligent medical practice and progress tracking platform. Our mission is to help medical students and professionals prepare for exams and improve their knowledge using data-driven insights and modern web technology.
          </p>
          <p className="mb-10 text-gray-700 dark:text-gray-300 text-center font-medium">
            The platform leverages data science and analytics to provide personalized feedback, progress tracking, and preparation estimation for each user. We believe in making learning efficient, engaging, and measurable.
          </p>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 text-center">Our Team</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {team.map(member => (
              <div key={member.name} className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 rounded-[6px] shadow-sm p-6 w-64 border border-gray-200 dark:border-gray-700">
                <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-2 border-gray-900 dark:border-white shadow-sm">
                  <img src={member.img} alt={member.name} className="object-cover w-full h-full" />
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-white mb-1">{member.name}</div>
                <div className="text-gray-600 dark:text-gray-400 font-bold mb-2">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 