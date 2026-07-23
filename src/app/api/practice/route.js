import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
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

    const adaptive = request.nextUrl.searchParams.get('adaptive') === 'true';

    try {
      // Get or create progress record
      let progress = await Progress.findOne({ userId, subject }).populate('mistakes');
      if (!progress) {
        progress = new Progress({ userId, subject });
        await progress.save();
      }
  
      let nextQuestion = null;
  
      // Adaptive Logic
      if (adaptive && progress.mistakes && progress.mistakes.length > 0) {
        // Find most common topic among mistakes
        const topicCounts = {};
        for (const mistake of progress.mistakes) {
          if (mistake.topic_name) {
            topicCounts[mistake.topic_name] = (topicCounts[mistake.topic_name] || 0) + 1;
          }
        }
        
        // Sort topics by frequency (descending)
        const sortedTopics = Object.keys(topicCounts).sort((a, b) => topicCounts[b] - topicCounts[a]);
        
        // Try to find an incomplete question from the weakest topic
        for (const weakTopic of sortedTopics) {
          nextQuestion = await MCQ.findOne({
            subject_name: subject,
            topic_name: weakTopic,
            _id: { $nin: progress.completedQuestions }
          });
          if (nextQuestion) break;
        }
      }
  
      // Fallback or regular logic
      if (!nextQuestion) {
        nextQuestion = await MCQ.findOne({
          subject_name: subject,
          _id: { $nin: progress.completedQuestions }
        }).skip(progress.currentIndex);
      }
  
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