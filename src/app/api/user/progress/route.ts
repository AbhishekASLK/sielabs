import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import ProgramProgress from '@/models/ProgramProgress';
import { getOrSeedPrograms } from '@/lib/programService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userParam = searchParams.get('user')?.trim() || '';
    const emailParam = searchParams.get('email')?.trim() || '';
    const identifier = userParam || emailParam;

    if (!identifier) {
      return NextResponse.json({ message: 'User identifier is required', programs: [] }, { status: 400 });
    }

    await connectToDatabase();

    const conditions: any[] = [];
    if (userParam) {
      conditions.push({ name: userParam });
      conditions.push({ email: userParam });
      const safeUser = userParam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      conditions.push({ name: { $regex: new RegExp(`^${safeUser}$`, 'i') } });
      conditions.push({ email: { $regex: new RegExp(`^${safeUser}$`, 'i') } });
    }
    if (emailParam) {
      conditions.push({ email: emailParam });
      conditions.push({ name: emailParam });
      const safeEmail = emailParam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      conditions.push({ email: { $regex: new RegExp(`^${safeEmail}$`, 'i') } });
    }

    const user = await User.findOne({ $or: conditions }).select('-password');

    if (!user) {
      return NextResponse.json({ 
        programs: [],
        message: 'User not found' 
      }, { status: 200 });
    }

    // Fetch dynamic programs (with modules & subtopics) from DB
    const allPrograms = await getOrSeedPrograms().catch(() => []);

    // Fetch all global program progress
    let allProgress: any[] = [];
    try {
      allProgress = await ProgramProgress.find({});
    } catch {
      allProgress = [];
    }

    const progressMap: Record<string, string[]> = {};
    allProgress.forEach(p => {
      if (p?.programId) {
        progressMap[p.programId] = p.completedModules || [];
      }
    });

    const enrolledProgramsList = user.enrolledPrograms || [];

    // Enrich enrolled programs with GLOBAL program progress
    const enrichedPrograms = enrolledProgramsList.map((ep: any) => {
      const epId = typeof ep === 'string' ? ep : (ep?.programId || ep?.programName || '');
      const epName = typeof ep === 'string' ? ep : (ep?.programName || ep?.programId || '');

      const def = (allPrograms || []).find(p => 
        (p.id && epId && p.id.toLowerCase() === epId.toLowerCase()) || 
        (p.title && epId && p.title.toLowerCase() === epId.toLowerCase()) ||
        (epName && p.title && p.title.toLowerCase() === epName.toLowerCase()) ||
        (epName && p.id && p.id.toLowerCase() === epName.toLowerCase())
      );
      const targetProgramId = def ? def.id : epId;
      const totalModules = def && Array.isArray(def.modules) ? def.modules.length : 0;
      // Global completed modules for this program from database!
      const globalCompletedList = progressMap[targetProgramId] || progressMap[epId] || [];
      const completedCount = globalCompletedList.length;
      const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

      const modulesWithStatus = (def && Array.isArray(def.modules) ? def.modules : []).map(m => ({
        ...m,
        isCompleted: globalCompletedList.includes(m.id)
      }));

      return {
        programId: targetProgramId,
        programName: def?.title || epName || 'SieLabs Program',
        badge: def?.badge || 'Cohort Program',
        schedule: def?.schedule || 'Weekend Cohort',
        duration: def?.duration || '4 Months',
        link: def?.link || '/programs/index.html',
        enrolledAt: (typeof ep === 'object' && ep?.enrolledAt) ? ep.enrolledAt : new Date(),
        totalModules,
        completedCount,
        percentage,
        isCompleted: percentage === 100,
        modules: modulesWithStatus
      };
    });

    return NextResponse.json({
      userName: user.name,
      userEmail: user.email,
      role: user.role || 'student',
      programs: enrichedPrograms
    }, { status: 200 });
  } catch (error) {
    console.error('User progress GET error:', error);
    return NextResponse.json({ 
      programs: [],
      message: 'Failed to fetch progress', 
      error: String(error) 
    }, { status: 200 });
  }
}
