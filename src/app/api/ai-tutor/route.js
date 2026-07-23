import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// Initialize Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !context) {
      return NextResponse.json({ error: "Missing messages or context" }, { status: 400 });
    }

    const systemMessage = {
      role: "system",
      content: `You are an expert, encouraging medical AI tutor. 
You are helping a student review a multiple choice question they just attempted.
Use the Socratic method: DO NOT give them the direct answer immediately if they ask for it. Instead, ask guiding questions to help them think through the pathophysiology, pharmacology, or clinical reasoning. 
Be concise, friendly, and professional.

### CURRENT MCQ CONTEXT ###
Question: ${context.question}
Options:
${context.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n")}

Correct Answer: ${context.correctAnswer}
User Selected: ${context.userSelected || "None yet"}
AI Explanation Context: ${context.explanation}
###########################`,
    };

    // Make the streaming request to Groq
    const stream = await groq.chat.completions.create({
      messages: [systemMessage, ...messages],
      model: "llama3-70b-8192",
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    });

    // Create a ReadableStream to stream the response to the client
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI Tutor API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate tutor response." },
      { status: 500 }
    );
  }
}
