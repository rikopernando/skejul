import { db } from '@/db';
import { user, account, session, verification } from '@/db/schema/auth';
import { profiles, teachers, subjects, classes, rooms, scheduleSlots, announcements, swapRequests } from '@/db/schema';

async function resetDatabase() {
  console.log('Resetting database...');
  
  try {
    // Drop all tables in correct order to avoid foreign key constraints
    console.log('Dropping tables...');
    
    // Drop schedule-related tables first
    await db.delete(swapRequests);
    await db.delete(announcements);
    await db.delete(scheduleSlots);
    
    // Drop master data tables
    await db.delete(teachers);
    await db.delete(subjects);
    await db.delete(classes);
    await db.delete(rooms);
    
    // Drop auth-related tables
    await db.delete(profiles);
    await db.delete(account);
    await db.delete(session);
    await db.delete(verification);
    await db.delete(user);
    
    console.log('Database reset completed successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}

resetDatabase();