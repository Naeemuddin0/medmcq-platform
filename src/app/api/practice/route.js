import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect.js';
import MCQ from '../../../models/MCQ.js';
import Progress from '../../../models/Progress.js';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions.js';

export async function GET(request) {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  console.log('SESSION:', session);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const subject = request.nextUrl.searchParams.get('subject');
  
  if (!subject) {
    return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
  }

  try {
    // Get or create progress record
    let progress = await Progress.findOne({ userId, subject });
    if (!progress) {
      progress = new Progress({ userId, subject });
      await progress.save();
    }

    // Get next question
    const nextQuestion = await MCQ.findOne({
      subject_name: subject,
      _id: { $nin: progress.completedQuestions }
    }).skip(progress.currentIndex);

    if (!nextQuestion) {
      return NextResponse.json({ 
        message: 'No more questions available', 
        completed: true 
      });
    }

    // Build options array and correct answer
    const options = [
      nextQuestion.opa,
      nextQuestion.opb,
      nextQuestion.opc,
      nextQuestion.opd
    ];
    const correctAnswer = options[parseInt(nextQuestion.cop, 10)];

    return NextResponse.json({
      question: {
        id: nextQuestion._id,
        text: nextQuestion.question,
        options,
        explanation: nextQuestion.exp,
        correctAnswer
      },
      progress: progress.currentIndex,
      total: await MCQ.countDocuments({ subject_name: subject })
    });
  } catch (error) {
    console.error('Practice API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 