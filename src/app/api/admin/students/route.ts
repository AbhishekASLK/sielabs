import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function GET(req: Request) {
  try {
    const authorized = await isAuthorizedAdmin(req);
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();
    
    // Fetch all student users (or all users)
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    const students = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      mobile: u.mobile || '',
      role: u.role || 'student',
      enrolledPrograms: u.enrolledPrograms || [],
      createdAt: u.createdAt
    }));

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error('Admin students GET error:', error);
    return NextResponse.json({ message: 'Failed to fetch students', error: String(error) }, { status: 500 });
  }
}
