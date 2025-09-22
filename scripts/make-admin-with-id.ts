import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function makeAdminWithId(userId: string) {
  console.log(`Making user ${userId} an admin...`);
  
  try {
    // First check if profile exists
    const existingProfile = await db.select().from(profiles).where(eq(profiles.id, userId));
    
    if (existingProfile.length === 0) {
      console.log('Profile does not exist, creating one...');
      // Create profile if it doesn't exist
      await db.insert(profiles).values({
        id: userId,
        fullName: 'Admin User',
        role: 'admin'
      });
      console.log('Profile created and user made admin');
    } else {
      // Update existing profile
      await db.update(profiles)
        .set({ role: 'admin' })
        .where(eq(profiles.id, userId));
      console.log('User updated to admin role');
    }
  } catch (error) {
    console.error('Error making user admin:', error);
  }
}

// Get user ID from command line arguments
const userId = process.argv[2];

if (!userId) {
  console.log('Usage: npm run db:make-admin-with-id <user-id>');
  console.log('To find user IDs, run: npm run db:list-users');
  process.exit(1);
}

makeAdminWithId(userId);