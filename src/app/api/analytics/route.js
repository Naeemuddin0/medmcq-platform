import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions.js';
import dbConnect from '../../../lib/dbConnect.js';
import Progress from '../../../models/Progress.js';
import MCQ from '../../../models/MCQ.js';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    const subjects = [
      'Anatomy', 'Physiology', 'Biochemistry',
      'Pathology', 'Microbiology', 'Pharmacology',
    ];

    const stats = [];
    let totalQuestionsAnswered = 0;
    let totalCorrectAnswers = 0;

    for (const subject of subjects) {
      const prog = await Progress.findOne({ userId, subject });
      const total = await MCQ.countDocuments({ subject_name: subject });
      
      const completed = prog ? (prog.completedQuestions?.length || 0) : 0;
      const correct = prog ? (prog.correctCount || 0) : 0;
      
      totalQuestionsAnswered += completed;
      totalCorrectAnswers += correct;

      stats.push({
        subject,
        completed,
        total,
        correct,
        accuracy: completed > 0 ? Math.round((correct / completed) * 100) : 0
      });
    }

    const overallAccuracy = totalQuestionsAnswered > 0 
      ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100) 
      : 0;

    // Generate AI Study Plan using Groq
    let studyPlan = "Not enough data to generate a study plan. Please complete more practice questions!";
    
    if (totalQuestionsAnswered > 5) {
      const prompt = `You are an expert medical tutor analyzing a student's performance data. 
Here is the student's accuracy across different subjects:
${stats.map(s => `- ${s.subject}: ${s.accuracy}% accuracy (${s.completed} answered)`).join('\n')}

Overall Accuracy: ${overallAccuracy}%

Provide a concise, highly actionable, and encouraging 3-paragraph study plan for this student. Focus on their weakest subjects and suggest specific learning strategies. Do not use markdown headers, just plain paragraphs.`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-70b-8192',
        temperature: 0.5,
      });

      studyPlan = completion.choices[0]?.message?.content || studyPlan;
    }

    return NextResponse.json({
      stats,
      overallAccuracy,
      totalQuestionsAnswered,
      studyPlan
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Server error fetching analytics' }, { status: 500 });
  }
}
