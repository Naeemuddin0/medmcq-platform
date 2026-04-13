import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request) {
  const { name, email, message } = await request.json();
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'viralviral906@gmail.com',
      subject: 'New Contact Form Submission',
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
} 