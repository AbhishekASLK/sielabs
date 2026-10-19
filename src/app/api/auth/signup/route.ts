import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await connectToDatabase();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ message: 'User already exists' }, { status: 400 });

    // Default role for standard signups is student
    const newUser = await User.create({ 
      name, 
      email, 
      password, 
      role: 'student',
      enrolledPrograms: []
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'An error occurred', error: String(error) }, { status: 500 });
  }
}