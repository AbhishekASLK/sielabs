import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Program from '@/models/Program';
import ProgramProgress from '@/models/ProgramProgress';
import { getOrSeedPrograms } from '@/lib/programService';

import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const programs = await getOrSeedPrograms();
    return NextResponse.json({ programs }, { status: 200 });
  } catch (error) {
    console.error('Fetch programs error:', error);
    return NextResponse.json({ message: 'Failed to fetch programs', error: String(error) }, { status: 500 });
  }
}

// Add Module to Program
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adminUser, programId, title, summary, subtopics } = body;

    const authorized = await isAuthorizedAdmin(req, adminUser);
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    if (!programId || !title?.trim()) {
      return NextResponse.json({ message: 'programId and title are required' }, { status: 400 });
    }

    await connectToDatabase();
    // Ensure programs are seeded
    await getOrSeedPrograms();

    const program = await Program.findOne({ programId });
    if (!program) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    // Auto calculate next module ID
    const nextNum = (program.modules?.length || 0) + 1;
    const newModuleId = String(nextNum).padStart(2, '0');

    const cleanSubtopics = Array.isArray(subtopics)
      ? subtopics.map((s: string) => String(s).trim()).filter(Boolean)
      : [];

    const newModule = {
      id: newModuleId,
      title: title.trim(),
      summary: (summary || '').trim(),
      subtopics: cleanSubtopics
    };

    if (!program.modules) {
      program.modules = [];
    }

    program.modules.push(newModule);
    await program.save();

    return NextResponse.json({
      message: `Module ${newModuleId} added successfully to ${program.title}`,
      module: newModule,
      modules: program.modules
    }, { status: 201 });
  } catch (error) {
    console.error('Add module error:', error);
    return NextResponse.json({ message: 'Failed to add module', error: String(error) }, { status: 500 });
  }
}

// Remove Module from Program
export async function DELETE(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { searchParams } = new URL(req.url);
    const adminUser = body.adminUser || searchParams.get('adminUser') || searchParams.get('admin');
    const programId = body.programId || searchParams.get('programId');
    const moduleId = body.moduleId || searchParams.get('moduleId');

    const authorized = await isAuthorizedAdmin(req, adminUser);
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    if (!programId || !moduleId) {
      return NextResponse.json({ message: 'programId and moduleId are required' }, { status: 400 });
    }

    await connectToDatabase();
    const program = await Program.findOne({ programId });
    if (!program) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    // Filter out the module
    program.modules = (program.modules || []).filter((m: { id: string }) => m.id !== moduleId);
    await program.save();

    // Also clean up from global completed progress if present
    const progress = await ProgramProgress.findOne({ programId });
    if (progress && progress.completedModules) {
      progress.completedModules = progress.completedModules.filter((id: string) => id !== moduleId);
      await progress.save();
    }

    return NextResponse.json({
      message: `Module ${moduleId} removed successfully`,
      modules: program.modules
    }, { status: 200 });
  } catch (error) {
    console.error('Delete module error:', error);
    return NextResponse.json({ message: 'Failed to delete module', error: String(error) }, { status: 500 });
  }
}

// Update Module in Program
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { adminUser, programId, moduleId, title, summary } = body;

    const authorized = await isAuthorizedAdmin(req, adminUser);
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    if (!programId || !moduleId || !title?.trim()) {
      return NextResponse.json({ message: 'programId, moduleId, and title are required' }, { status: 400 });
    }

    await connectToDatabase();
    await getOrSeedPrograms();

    const program = await Program.findOne({ programId });
    if (!program) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    const mod = (program.modules || []).find((m: { id: string }) => m.id === moduleId);
    if (!mod) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 });
    }

    mod.title = title.trim();
    if (summary !== undefined) mod.summary = summary.trim();

    program.markModified('modules');
    await program.save();

    return NextResponse.json({
      message: `Module ${moduleId} updated successfully`,
      module: mod,
      modules: program.modules
    }, { status: 200 });
  } catch (error) {
    console.error('Update module error:', error);
    return NextResponse.json({ message: 'Failed to update module', error: String(error) }, { status: 500 });
  }
}
