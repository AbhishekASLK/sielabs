import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import ProgramProgress from '@/models/ProgramProgress';
import { getOrSeedPrograms } from '@/lib/programService';

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
      return NextResponse.json({ 
        programs: [],
        message: 'User not found' 
      }, { status: 200 });
    }

    // Fetch dynamic programs (with modules & subtopics) from DB
    const allPrograms = await getOrSeedPrograms();

    // Fetch all global program progress
    const allProgress = await ProgramProgress.find({});
    const progressMap: Record<string, string[]> = {};
    allProgress.forEach(p => {
      progressMap[p.programId] = p.completedModules || [];
    });

    const enrolledProgramsList = user.enrolledPrograms || [];

    // Enrich enrolled programs with GLOBAL program progress
    const enrichedPrograms = enrolledProgramsList.map((ep: {
      programId: string;
      programName: string;
      enrolledAt: Date;
    }) => {
      const def = allPrograms.find(p => 
        p.id === ep.programId || 
        p.title.toLowerCase() === (ep.programId || '').toLowerCase() ||
        (ep.programName && p.title.toLowerCase() === ep.programName.toLowerCase()) ||
        (ep.programName && p.id.toLowerCase() === ep.programName.toLowerCase())
      );
      const targetProgramId = def ? def.id : ep.programId;
      const totalModules = def ? def.modules.length : 0;
      // Global completed modules for this program from database!
      const globalCompletedList = progressMap[targetProgramId] || progressMap[ep.programId] || [];
      const completedCount = globalCompletedList.length;
      const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

      const modulesWithStatus = (def ? def.modules : []).map(m => ({
        ...m,
        isCompleted: globalCompletedList.includes(m.id)
      }));

      return {
        programId: targetProgramId,
        programName: def?.title || ep.programName || 'SieLabs Program',
        badge: def?.badge || 'Cohort Program',
        schedule: def?.schedule || 'Weekend Cohort',
        duration: def?.duration || '4 Months',
        link: def?.link || '/programs/index.html',
        enrolledAt: ep.enrolledAt,
        totalModules,
        completedCount,
        percentage,
        isCompleted: percentage === 100,
        modules: modulesWithStatus
      };
    });

    const envAdmin = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const isAdmin = user.role === 'admin' || (envAdmin && (user.email?.toLowerCase() === envAdmin || user.name?.toLowerCase() === envAdmin));

    return NextResponse.json({
      userName: user.name,
      userEmail: user.email,
      role: isAdmin ? 'admin' : (user.role || 'student'),
      programs: enrichedPrograms
    }, { status: 200 });
  } catch (error) {
    console.error('User progress GET error:', error);
    return NextResponse.json({ message: 'Failed to fetch progress', error: String(error) }, { status: 500 });
  }
}
