import { db } from '@/db';
import { teachers, subjects, classes, rooms, scheduleSlots } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function seedSchedule() {
  console.log('🌱 Starting schedule seeding...\n');

  try {
    // Check if schedule slots already exist
    const existingSlots = await db.select().from(scheduleSlots).limit(1);
    if (existingSlots.length > 0) {
      console.log('⚠️  Schedule slots already exist. Skipping seed...');
      console.log('💡 To re-seed, please delete existing schedule slots first.');
      process.exit(0);
    }

    // Fetch existing master data
    console.log('📋 Fetching existing master data...');
    const existingTeachers = await db.select().from(teachers);
    const existingSubjects = await db.select().from(subjects);
    const existingClasses = await db.select().from(classes);
    const existingRooms = await db.select().from(rooms);

    // Validate that we have enough data
    if (existingTeachers.length === 0) {
      console.log('❌ No teachers found. Please create teachers first.');
      process.exit(1);
    }
    if (existingSubjects.length === 0) {
      console.log('❌ No subjects found. Please create subjects first.');
      process.exit(1);
    }
    if (existingClasses.length === 0) {
      console.log('❌ No classes found. Please create classes first.');
      process.exit(1);
    }
    if (existingRooms.length === 0) {
      console.log('❌ No rooms found. Please create rooms first.');
      process.exit(1);
    }

    console.log(`✅ Found ${existingTeachers.length} teachers`);
    console.log(`✅ Found ${existingSubjects.length} subjects`);
    console.log(`✅ Found ${existingClasses.length} classes`);
    console.log(`✅ Found ${existingRooms.length} rooms\n`);

    // Use the existing data
    const insertedTeachers = existingTeachers;
    const insertedSubjects = existingSubjects;
    const insertedClasses = existingClasses;
    const insertedRooms = existingRooms;

    // Seed Schedule Slots
    console.log('📅 Seeding schedule slots...');

    // Helper functions to safely get items with wraparound
    const getTeacher = (index: number) => insertedTeachers[index % insertedTeachers.length];
    const getSubject = (index: number) => insertedSubjects[index % insertedSubjects.length];
    const getClass = (index: number) => insertedClasses[index % insertedClasses.length];
    const getRoom = (index: number) => insertedRooms[index % insertedRooms.length];

    const scheduleSlotsData = [];

    // Create a weekly schedule using the first available class
    const targetClass = getClass(0);
    console.log(`Creating schedule for class: ${targetClass.name}\n`);

    // Monday (1)
    scheduleSlotsData.push(
      {
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '09:30',
        teacherId: getTeacher(0).id,
        subjectId: getSubject(0).id,
        classId: targetClass.id,
        roomId: getRoom(0).id,
      },
      {
        dayOfWeek: 1,
        startTime: '09:45',
        endTime: '11:15',
        teacherId: getTeacher(1).id,
        subjectId: getSubject(1).id,
        classId: targetClass.id,
        roomId: getRoom(1).id,
      },
      {
        dayOfWeek: 1,
        startTime: '11:30',
        endTime: '13:00',
        teacherId: getTeacher(2).id,
        subjectId: getSubject(2).id,
        classId: targetClass.id,
        roomId: getRoom(2).id,
      },
      {
        dayOfWeek: 1,
        startTime: '13:15',
        endTime: '14:45',
        teacherId: getTeacher(3).id,
        subjectId: getSubject(3).id,
        classId: targetClass.id,
        roomId: getRoom(3).id,
      }
    );

    // Tuesday (2) - Grade 10A
    scheduleSlotsData.push(
      {
        dayOfWeek: 2,
        startTime: '08:00',
        endTime: '09:30',
        teacherId: getTeacher(3).id,
        subjectId: getSubject(3).id, // Chemistry
        classId: getClass(0).id,
        roomId: getRoom(5).id, // Science Lab 2
      },
      {
        dayOfWeek: 2,
        startTime: '09:45',
        endTime: '11:15',
        teacherId: getTeacher(4).id,
        subjectId: getSubject(4).id, // Biology
        classId: getClass(0).id,
        roomId: getRoom(4).id,
      },
      {
        dayOfWeek: 2,
        startTime: '11:30',
        endTime: '13:00',
        teacherId: getTeacher(5).id,
        subjectId: getSubject(5).id, // History
        classId: getClass(0).id,
        roomId: getRoom(2).id,
      },
      {
        dayOfWeek: 2,
        startTime: '13:15',
        endTime: '14:45',
        teacherId: getTeacher(0).id,
        subjectId: getSubject(0).id, // Math
        classId: getClass(0).id,
        roomId: getRoom(0).id,
      }
    );

    // Wednesday (3) - Grade 10A
    scheduleSlotsData.push(
      {
        dayOfWeek: 3,
        startTime: '08:00',
        endTime: '09:30',
        teacherId: getTeacher(1).id,
        subjectId: getSubject(1).id, // English
        classId: getClass(0).id,
        roomId: getRoom(1).id,
      },
      {
        dayOfWeek: 3,
        startTime: '09:45',
        endTime: '11:15',
        teacherId: getTeacher(7).id,
        subjectId: getSubject(6).id, // Geography
        classId: getClass(0).id,
        roomId: getRoom(3).id,
      },
      {
        dayOfWeek: 3,
        startTime: '11:30',
        endTime: '13:00',
        teacherId: getTeacher(2).id,
        subjectId: getSubject(2).id, // Physics
        classId: getClass(0).id,
        roomId: getRoom(4).id,
      },
      {
        dayOfWeek: 3,
        startTime: '13:15',
        endTime: '14:45',
        teacherId: getTeacher(3).id,
        subjectId: getSubject(3).id, // Chemistry
        classId: getClass(0).id,
        roomId: getRoom(5).id,
      }
    );

    // Thursday (4) - Grade 10A
    scheduleSlotsData.push(
      {
        dayOfWeek: 4,
        startTime: '08:00',
        endTime: '09:30',
        teacherId: getTeacher(0).id,
        subjectId: getSubject(0).id, // Math
        classId: getClass(0).id,
        roomId: getRoom(0).id,
      },
      {
        dayOfWeek: 4,
        startTime: '09:45',
        endTime: '11:15',
        teacherId: getTeacher(4).id,
        subjectId: getSubject(4).id, // Biology
        classId: getClass(0).id,
        roomId: getRoom(4).id,
      },
      {
        dayOfWeek: 4,
        startTime: '11:30',
        endTime: '13:00',
        teacherId: getTeacher(1).id,
        subjectId: getSubject(1).id, // English
        classId: getClass(0).id,
        roomId: getRoom(1).id,
      },
      {
        dayOfWeek: 4,
        startTime: '13:15',
        endTime: '14:45',
        teacherId: getTeacher(5).id,
        subjectId: getSubject(5).id, // History
        classId: getClass(0).id,
        roomId: getRoom(2).id,
      }
    );

    // Friday (5) - Grade 10A
    scheduleSlotsData.push(
      {
        dayOfWeek: 5,
        startTime: '08:00',
        endTime: '09:30',
        teacherId: getTeacher(2).id,
        subjectId: getSubject(2).id, // Physics
        classId: getClass(0).id,
        roomId: getRoom(4).id,
      },
      {
        dayOfWeek: 5,
        startTime: '09:45',
        endTime: '11:15',
        teacherId: getTeacher(0).id,
        subjectId: getSubject(0).id, // Math
        classId: getClass(0).id,
        roomId: getRoom(0).id,
      },
      {
        dayOfWeek: 5,
        startTime: '11:30',
        endTime: '13:00',
        teacherId: getTeacher(7).id,
        subjectId: getSubject(6).id, // Geography
        classId: getClass(0).id,
        roomId: getRoom(3).id,
      },
      {
        dayOfWeek: 5,
        startTime: '13:15',
        endTime: '14:45',
        teacherId: getTeacher(6).id,
        subjectId: getSubject(7).id, // PE
        classId: getClass(0).id,
        roomId: getRoom(7).id,
      }
    );

    // Add some schedule for Grade 10B (Monday & Tuesday)
    scheduleSlotsData.push(
      // Monday - Grade 10B
      {
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '09:30',
        teacherId: getTeacher(1).id,
        subjectId: getSubject(1).id, // English
        classId: getClass(1).id, // Grade 10B
        roomId: getRoom(2).id,
      },
      {
        dayOfWeek: 1,
        startTime: '09:45',
        endTime: '11:15',
        teacherId: getTeacher(0).id,
        subjectId: getSubject(0).id, // Math
        classId: getClass(1).id,
        roomId: getRoom(3).id,
      },
      {
        dayOfWeek: 1,
        startTime: '11:30',
        endTime: '13:00',
        teacherId: getTeacher(4).id,
        subjectId: getSubject(4).id, // Biology
        classId: getClass(1).id,
        roomId: getRoom(5).id,
      },
      // Tuesday - Grade 10B
      {
        dayOfWeek: 2,
        startTime: '08:00',
        endTime: '09:30',
        teacherId: getTeacher(2).id,
        subjectId: getSubject(2).id, // Physics
        classId: getClass(1).id,
        roomId: getRoom(4).id,
      },
      {
        dayOfWeek: 2,
        startTime: '09:45',
        endTime: '11:15',
        teacherId: getTeacher(5).id,
        subjectId: getSubject(5).id, // History
        classId: getClass(1).id,
        roomId: getRoom(2).id,
      },
      {
        dayOfWeek: 2,
        startTime: '11:30',
        endTime: '13:00',
        teacherId: getTeacher(3).id,
        subjectId: getSubject(3).id, // Chemistry
        classId: getClass(1).id,
        roomId: getRoom(5).id,
      }
    );

    const insertedScheduleSlots = await db.insert(scheduleSlots).values(scheduleSlotsData).returning();
    console.log(`✅ Created ${insertedScheduleSlots.length} schedule slots\n`);

    console.log('✨ Schedule seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Using ${insertedTeachers.length} existing teachers`);
    console.log(`   - Using ${insertedSubjects.length} existing subjects`);
    console.log(`   - Using ${insertedClasses.length} existing classes`);
    console.log(`   - Using ${insertedRooms.length} existing rooms`);
    console.log(`   - Created ${insertedScheduleSlots.length} new schedule slots`);
    console.log('\n🎯 You can now view the schedule at /dashboard/schedule');

  } catch (error) {
    console.error('❌ Error seeding schedule:', error);
    throw error;
  }
}

// Run the seeder
seedSchedule()
  .then(() => {
    console.log('\n✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seed script failed:', error);
    process.exit(1);
  });
