import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions.js';
import dbConnect from '../../../../lib/dbConnect.js';
import Quiz from '../../../../models/Quiz.js';
import Groq from 'groq-sdk';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import officeParser from 'officeparser';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('file');
    const strategy = formData.get('strategy') || 'comprehensive';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    const isImage = fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
    
    let text = '';
    
    if (!isImage) {
      if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      } else if (fileName.endsWith('.docx')) {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } else if (fileName.endsWith('.pptx')) {
        text = await officeParser.parseOffice(buffer, { fileType: 'pptx' });
      } else {
        text = buffer.toString('utf-8');
      }

      if (!text || text.trim().length === 0) {
        return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 });
      }
    }

    let systemPrompt = `You are an expert medical educator and AI Quiz Builder.
Your task is to ${isImage ? 'analyze the provided clinical image (like an X-ray, ECG, or Dermatology photo)' : 'read the provided medical text'} and generate a high-quality Multiple Choice Question (MCQ) quiz based on it.
You must return the response strictly as a JSON object matching this schema:
{
  "title": "A fitting title for the quiz based on the document",
  "questions": [
    {
      "question": "The question text",
      "options": {
        "a": "Option A",
        "b": "Option B",
        "c": "Option C",
        "d": "Option D"
      },
      "correctAnswer": "a", // strictly one of: a, b, c, d
      "explanation": "Detailed explanation of why the correct answer is right and others are wrong."
    }
  ]
}`;

    if (strategy === 'high-yield') {
      systemPrompt += `\nFocus ONLY on the most critical, high-yield information, life-threatening conditions, or core concepts. Generate exactly 5 highly difficult questions.`;
    } else {
      systemPrompt += `\nProvide comprehensive coverage of the document. Distribute the questions evenly across different sections of the text. Generate exactly 10 questions.`;
    }

    let aiResponse = "";

    if (isImage) {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
            { role: 'user', parts: [
                { text: systemPrompt },
                { inlineData: { mimeType, data: buffer.toString('base64') } }
            ]}
        ],
        config: { responseMimeType: "application/json" }
      });
      aiResponse = response.text;
    } else {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is the document text:\n\n${text}` }
        ],
        model: 'llama3-70b-8192',
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });
      aiResponse = completion.choices[0]?.message?.content;
    }

    if (!aiResponse) {
       throw new Error('AI returned an empty response');
    }

    let quizData;
    try {
      quizData = JSON.parse(aiResponse);
    } catch (e) {
      console.error("JSON parse error on AI response:", aiResponse);
      throw new Error('AI did not return valid JSON');
    }

    const newQuiz = new Quiz({
      userId: session.user.id,
      title: quizData.title || file.name,
      documentName: file.name,
      questions: quizData.questions
    });

    await newQuiz.save();

    return NextResponse.json({ success: true, quizId: newQuiz._id });

  } catch (error) {
    console.error('Error generating AI Quiz:', error);
    return NextResponse.json({ error: 'An error occurred while generating the quiz.', details: error.message }, { status: 500 });
  }
}
