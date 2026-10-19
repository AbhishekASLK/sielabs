import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Program from '@/models/Program';
import { getOrSeedPrograms } from '@/lib/programService';

import { isAuthorizedAdmin } from '@/lib/adminAuth';

// Add Subtopic to a Module
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adminUser, programId, moduleId, subtopic } = body;

    const authorized = await isAuthorizedAdmin(req, adminUser);
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    if (!programId || !moduleId || !subtopic?.trim()) {
      return NextResponse.json({ message: 'programId, moduleId, and subtopic are required' }, { status: 400 });
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

    if (!mod.subtopics) {
      mod.subtopics = [];
    }

    const cleanText = subtopic.trim();
    mod.subtopics.push(cleanText);
    program.markModified('modules');
    await program.save();

    return NextResponse.json({
      message: `Subtopic added to Module ${moduleId}`,
      subtopics: mod.subtopics
    }, { status: 201 });
  } catch (error) {
    console.error('Add subtopic error:', error);
    return NextResponse.json({ message: 'Failed to add subtopic', error: String(error) }, { status: 500 });
  }
}

// Remove Subtopic from a Module
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
    const subtopicIndex = body.subtopicIndex !== undefined 
      ? body.subtopicIndex 
      : (searchParams.get('subtopicIndex') !== null ? parseInt(searchParams.get('subtopicIndex')!, 10) : undefined);
    const subtopicText = body.subtopicText || searchParams.get('subtopicText');

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

    const mod = (program.modules || []).find((m: { id: string }) => m.id === moduleId);
    if (!mod || !mod.subtopics) {
      return NextResponse.json({ message: 'Module or subtopics not found' }, { status: 404 });
    }

    if (typeof subtopicIndex === 'number' && subtopicIndex >= 0 && subtopicIndex < mod.subtopics.length) {
      mod.subtopics.splice(subtopicIndex, 1);
    } else if (subtopicText) {
      mod.subtopics = mod.subtopics.filter((s: string) => s !== subtopicText);
    } else {
      return NextResponse.json({ message: 'subtopicIndex or subtopicText is required' }, { status: 400 });
    }

    program.markModified('modules');
    await program.save();

    return NextResponse.json({
      message: `Subtopic removed from Module ${moduleId}`,
      subtopics: mod.subtopics
    }, { status: 200 });
  } catch (error) {
    console.error('Delete subtopic error:', error);
    return NextResponse.json({ message: 'Failed to delete subtopic', error: String(error) }, { status: 500 });
  }
}

// Update Subtopic in a Module
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { adminUser, programId, moduleId, subtopicIndex, newText } = body;

    const authorized = await isAuthorizedAdmin(req, adminUser);
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    if (!programId || !moduleId || subtopicIndex === undefined || !newText?.trim()) {
      return NextResponse.json({ message: 'programId, moduleId, subtopicIndex, and newText are required' }, { status: 400 });
    }

    await connectToDatabase();
    await getOrSeedPrograms();

    const program = await Program.findOne({ programId });
    if (!program) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    const mod = (program.modules || []).find((m: { id: string }) => m.id === moduleId);
    if (!mod || !mod.subtopics) {
      return NextResponse.json({ message: 'Module or subtopics not found' }, { status: 404 });
    }

    if (subtopicIndex < 0 || subtopicIndex >= mod.subtopics.length) {
      return NextResponse.json({ message: 'Invalid subtopic index' }, { status: 400 });
    }

    mod.subtopics[subtopicIndex] = newText.trim();
    program.markModified('modules');
    await program.save();

    return NextResponse.json({
      message: `Subtopic updated in Module ${moduleId}`,
      subtopics: mod.subtopics
    }, { status: 200 });
  } catch (error) {
    console.error('Update subtopic error:', error);
    return NextResponse.json({ message: 'Failed to update subtopic', error: String(error) }, { status: 500 });
  }
}

