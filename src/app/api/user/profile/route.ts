import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get('user') || searchParams.get('email');

    if (!identifier) {
      return NextResponse.json({ message: 'User identifier is required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({
      $or: [{ name: identifier }, { email: identifier }]
    }).select('-password');

    if (!user) {
      // Fallback for demo / localStorage users
      return NextResponse.json({
        user: {
          name: identifier,
          email: identifier,
          mobile: '',
          enrolledPrograms: ['Python with Machine Learning']
        }
      }, { status: 200 });
    }

    const mobileNumber = user.mobile || user.phone || '';

    // If the database document still has the old phone field, quietly unset it
    if (user.phone !== undefined) {
      User.updateOne({ _id: user._id }, { $unset: { phone: "" } }).exec().catch(() => {});
    }

    const envAdmin = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const isAdmin = user.role === 'admin' || (envAdmin && (user.email?.toLowerCase() === envAdmin || user.name?.toLowerCase() === envAdmin));
    const userRole = isAdmin ? 'admin' : (user.role || 'student');

    return NextResponse.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: mobileNumber,
        role: userRole,
        enrolledPrograms: user.enrolledPrograms || []
      } 
    }, { status: 200 });
  } catch {
    // Graceful fallback if database is not reachable
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get('user') || 'Student';
    const envAdmin = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const isAdmin = Boolean(envAdmin && identifier.toLowerCase() === envAdmin);
    return NextResponse.json({
      user: {
        name: identifier,
        email: identifier,
        mobile: '',
        role: isAdmin ? 'admin' : 'student',
        enrolledPrograms: []
      }
    }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, mobile, phone } = body;
    const mobileValue = (mobile || phone || '').trim();

    if (!name && !email) {
      return NextResponse.json({ message: 'Name or email is required' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const updatedUser = await User.findOneAndUpdate(
        { $or: [{ email: email?.trim() }, { name: name?.trim() }] },
        { 
          $set: { 
            name: name?.trim(), 
            email: email?.trim(), 
            mobile: mobileValue,
          },
          $unset: {
            phone: ""
          }
        },
        { new: true, upsert: false }
      ).select('-password');

      return NextResponse.json({
        message: 'Profile updated successfully',
        user: updatedUser || { name, email, mobile: mobileValue }
      }, { status: 200 });
    } catch {
      // Even if MongoDB fails, acknowledge client update
      return NextResponse.json({
        message: 'Profile updated locally',
        user: { name, email, mobile: mobileValue }
      }, { status: 200 });
    }
  } catch {
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}
