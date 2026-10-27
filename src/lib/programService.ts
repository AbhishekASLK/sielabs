import connectToDatabase from '@/lib/mongodb';
import Program from '@/models/Program';
import { PROGRAMS, ProgramDefinition } from '@/lib/programsData';

export async function getOrSeedPrograms(): Promise<ProgramDefinition[]> {
  try {
    await connectToDatabase();
    const dbPrograms = await Program.find({});

    if (dbPrograms.length === 0) {
      // Seed initial programs from programsData
      for (const prog of PROGRAMS) {
        await Program.create({
          programId: prog.id,
          title: prog.title,
          badge: prog.badge,
          schedule: prog.schedule,
          duration: prog.duration,
          link: prog.link,
          modules: prog.modules.map(m => ({
            id: m.id,
            title: m.title,
            subtopics: m.subtopics || []
          }))
        });
      }

      const seeded = await Program.find({});
      return seeded.map(doc => ({
        id: doc.programId,
        title: doc.title,
        badge: doc.badge,
        schedule: doc.schedule,
        duration: doc.duration,
        link: doc.link,
        modules: doc.modules.map((m: any) => ({
          id: m.id,
          title: m.title,
          subtopics: m.subtopics || []
        }))
      }));
    }

    return dbPrograms.map(doc => ({
      id: doc.programId,
      title: doc.title,
      badge: doc.badge,
      schedule: doc.schedule,
      duration: doc.duration,
      link: doc.link,
      modules: doc.modules.map((m: any) => ({
        id: m.id,
        title: m.title,
        subtopics: m.subtopics || []
      }))
    }));
  } catch (err) {
    console.warn('getOrSeedPrograms could not reach DB, using static fallback:', err);
    return PROGRAMS;
  }
}
