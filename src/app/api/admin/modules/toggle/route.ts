import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ProgramProgress from '@/models/ProgramProgress';

import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    await connectToDatabase();
    const allProgress = await ProgramProgress.find({});
    const progressMap: Record<string, string[]> = {};
    allProgress.forEach(p => {
      progressMap[p.programId] = p.completedModules || [];
    });
    return NextResponse.json({ progressMap }, { status: 200 });
  } catch (error) {
    console.error('Fetch program progress error:', error);
    return NextResponse.json({ message: 'Failed to fetch global progress', error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adminUser, programId, moduleId, completed } = body;

    const authorized = await isAuthorizedAdmin(req, adminUser);
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    if (!programId || !moduleId) {
      return NextResponse.json({ message: 'programId and moduleId are required' }, { status: 400 });
    }

    await connectToDatabase();

    let record = await ProgramProgress.findOne({ programId });
    if (!record) {
      record = new ProgramProgress({ programId, completedModules: [] });
    }

    const set = new Set<string>(record.completedModules || []);
    if (completed) {
      set.add(moduleId);
    } else {
      set.delete(moduleId);
    }

    record.completedModules = Array.from(set);
    await record.save();

    return NextResponse.json({
      message: `Global Module ${moduleId} marked as ${completed ? 'completed' : 'incomplete'} for program ${programId}`,
      programId,
      completedModules: record.completedModules
    }, { status: 200 });
  } catch (error) {
    console.error('Admin global module toggle error:', error);
    return NextResponse.json({ message: 'Failed to toggle global module', error: String(error) }, { status: 500 });
  }
}
