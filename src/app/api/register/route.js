import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../../models/User.js';
import dbConnect from '../../../lib/dbConnect.js';

export async function POST(request) {
  await dbConnect();
  const { name, email, password } = await request.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: 'User registered successfully', user }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 