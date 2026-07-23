import dbConnect from '../../../../lib/dbConnect';
import Quiz from '../../../../models/Quiz';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import QuizPlayer from './QuizPlayer';

export default async function QuizPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  await dbConnect();
  const quiz = await Quiz.findById(params.id).lean();
  
  if (!quiz) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600">Quiz not found</h1>
      </div>
    );
  }

  if (quiz.userId.toString() !== session.user.id) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
        <p>You do not have permission to view this quiz.</p>
      </div>
    );
  }

  // Pass plain JSON object to client component
  return <QuizPlayer quiz={JSON.parse(JSON.stringify(quiz))} />;
}
