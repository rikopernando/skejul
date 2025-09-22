import { db } from '@/db';
import { teachers, subjects, classes, rooms } from '@/db/schema';

async function seed() {
  console.log('Starting database seeding...');

  try {
    // Create sample subjects
    const sampleSubjects = [
      { name: 'Mathematics', code: 'MATH101', description: 'Basic Mathematics' },
      { name: 'Physics', code: 'PHYS101', description: 'Introduction to Physics' },
      { name: 'Chemistry', code: 'CHEM101', description: 'Basic Chemistry' },
      { name: 'Biology', code: 'BIOL101', description: 'Introduction to Biology' },
      { name: 'English', code: 'ENG101', description: 'English Literature' }
    ];

    const createdSubjects = [];
    for (const subject of sampleSubjects) {
      const newSubject = await db.insert(subjects).values({
        name: subject.name,
        code: subject.code,
        description: subject.description,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      createdSubjects.push(newSubject[0]);
    }
    console.log('Created subjects:', createdSubjects.length);

    // Create sample classes
    const sampleClasses = [
      { name: 'Class 10-A', grade: 10, academicYear: '2024/2025' },
      { name: 'Class 10-B', grade: 10, academicYear: '2024/2025' },
      { name: 'Class 11-A', grade: 11, academicYear: '2024/2025' },
      { name: 'Class 11-B', grade: 11, academicYear: '2024/2025' },
      { name: 'Class 12-A', grade: 12, academicYear: '2024/2025' }
    ];

    const createdClasses = [];
    for (const classItem of sampleClasses) {
      const newClass = await db.insert(classes).values({
        name: classItem.name,
        grade: classItem.grade,
        academicYear: classItem.academicYear,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      createdClasses.push(newClass[0]);
    }
    console.log('Created classes:', createdClasses.length);

    // Create sample rooms
    const sampleRooms = [
      { name: 'Room 101', capacity: 30, location: 'First Floor' },
      { name: 'Room 102', capacity: 25, location: 'First Floor' },
      { name: 'Room 201', capacity: 30, location: 'Second Floor' },
      { name: 'Room 202', capacity: 25, location: 'Second Floor' },
      { name: 'Lab 1', capacity: 20, location: 'Ground Floor' }
    ];

    const createdRooms = [];
    for (const room of sampleRooms) {
      const newRoom = await db.insert(rooms).values({
        name: room.name,
        capacity: room.capacity,
        location: room.location,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      createdRooms.push(newRoom[0]);
    }
    console.log('Created rooms:', createdRooms.length);

    console.log('\nDatabase seeding completed successfully!');
    console.log('NOTE: Please create users manually through the sign-up page at http://localhost:3000/sign-up');
    console.log('After creating an admin user, run "npm run db:make-admin" to give admin privileges');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

// Run the seed function
seed().then(() => {
  console.log('Seeding process finished.');
}).catch((error) => {
  console.error('Seeding process failed:', error);
});