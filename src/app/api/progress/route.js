import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect.js';
import Progress from '../../../models/Progress.js';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route.js';
import MCQ from '../../../models/MCQ.js';
import mongoose from 'mongoose';

export async function POST(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { questionId, subject, isCorrect } = await request.json();

  try {
    let progress = await Progress.findOneAndUpdate(
      { userId, subject },
      { $inc: { currentIndex: 1 } },
      { new: true, upsert: true }
    );

    // Always add attempted question to completedQuestions if not already present
    const qid = typeof questionId === 'string' ? new mongoose.Types.ObjectId(questionId) : questionId;
    if (!progress.completedQuestions.some(id => id.equals(qid))) {
      progress.completedQuestions.push(qid);
    }
    if (isCorrect) {
      progress.correctCount = (progress.correctCount || 0) + 1;
    }
    await progress.save();

    return NextResponse.json({ message: 'Progress updated', progress });
  } catch (error) {
    console.error('Update Progress API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { subject } = await request.json();

  try {
    const totalQuestions = await MCQ.countDocuments({ subject_name: subject });

    const progress = await Progress.findOneAndUpdate(
      { userId, subject },
      { currentIndex: 0, completedQuestions: [] },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: 'Progress reset', progress });
  } catch (error) {
    console.error('Reset Progress API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  // List of subjects to check
  const subjects = [
    'Anatomy',
    'Physiology',
    'Biochemistry',
    'Pathology',
    'Microbiology',
    'Pharmacology',
  ];
  const progress = {};
  for (const subject of subjects) {
    const prog = await Progress.findOne({ userId, subject });
    const total = await MCQ.countDocuments({ subject_name: subject });
    progress[subject] = {
      completed: prog ? (prog.completedQuestions?.length || 0) : 0,
      total,
      correctCount: prog ? (prog.correctCount || 0) : 0,
    };
  }
  return NextResponse.json({ progress });
} 