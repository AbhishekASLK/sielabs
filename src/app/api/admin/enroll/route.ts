import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getOrSeedPrograms } from '@/lib/programService';

import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adminUser, studentIdentifier, programId } = body;

    const authorized = await isAuthorizedAdmin(req, adminUser);
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    if (!studentIdentifier || !programId) {
      return NextResponse.json({ message: 'studentIdentifier and programId are required' }, { status: 400 });
    }

    const allPrograms = await getOrSeedPrograms();
    const program = allPrograms.find(p => p.id === programId || p.title.toLowerCase() === programId.toLowerCase());
    if (!program) {
      return NextResponse.json({ message: 'Invalid program ID' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({
      $or: [
        { email: studentIdentifier },
        { name: studentIdentifier },
        { _id: studentIdentifier.match(/^[0-9a-fA-F]{24}$/) ? studentIdentifier : null }
      ]
    });

    if (!user) {
      return NextResponse.json({ message: 'Student user not found' }, { status: 404 });
    }

    // Check if user already enrolled in this program
    const alreadyEnrolled = user.enrolledPrograms?.some(
      (ep: { programId: string }) => ep.programId === programId
    );

    if (alreadyEnrolled) {
      return NextResponse.json({ message: `Student is already enrolled in ${program.title}` }, { status: 400 });
    }

    const newEnrollment = {
      programId: program.id,
      programName: program.title,
      enrolledAt: new Date(),
      completedModules: []
    };

    if (!user.enrolledPrograms) {
      user.enrolledPrograms = [];
    }

    user.enrolledPrograms.push(newEnrollment);
    await user.save();

    return NextResponse.json({
      message: `Enrolled ${user.name} in ${program.title}`,
      enrolledPrograms: user.enrolledPrograms
    }, { status: 200 });
  } catch (error) {
    console.error('Admin enroll error:', error);
    return NextResponse.json({ message: 'Failed to enroll student', error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { adminUser, studentIdentifier, programId } = body;

    const authorized = await isAuthorizedAdmin(req, adminUser);
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    if (!studentIdentifier || !programId) {
      return NextResponse.json({ message: 'studentIdentifier and programId are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({
      $or: [
        { email: studentIdentifier },
        { name: studentIdentifier },
        { _id: studentIdentifier.match(/^[0-9a-fA-F]{24}$/) ? studentIdentifier : null }
      ]
    });

    if (!user) {
      return NextResponse.json({ message: 'Student user not found' }, { status: 404 });
    }

    user.enrolledPrograms = (user.enrolledPrograms || []).filter(
      (ep: { programId: string }) => ep.programId !== programId
    );

    await user.save();

    return NextResponse.json({
      message: `Unenrolled student from program`,
      enrolledPrograms: user.enrolledPrograms
    }, { status: 200 });
  } catch (error) {
    console.error('Admin unenroll error:', error);
    return NextResponse.json({ message: 'Failed to unenroll student', error: String(error) }, { status: 500 });
  }
}
