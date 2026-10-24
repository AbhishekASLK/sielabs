import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({
      $or: [{ email }, { name: email }]
    });
    if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    // Compare plain text passwords
    if (password !== user.password) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    const mobileNumber = user.mobile || user.phone || '';

    // If document still has legacy phone, clean it up
    if (user.phone !== undefined) {
      User.updateOne({ _id: user._id }, { $unset: { phone: "" } }).exec().catch(() => {});
    }

    const userRole = user.role === 'admin' ? 'admin' : (user.role || 'student');

    return NextResponse.json({
      message: 'Login successful',
      name: user.name,
      email: user.email,
      mobile: mobileNumber,
      role: userRole,
      enrolledPrograms: user.enrolledPrograms || [],
    }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}