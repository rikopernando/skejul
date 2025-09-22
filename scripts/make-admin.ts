import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function makeAdmin() {
  console.log('Making admin user...');
  
  try {
    // First check if profile exists
    const existingProfile = await db.select().from(profiles).where(eq(profiles.id, 'admin-user-id'));
    
    if (existingProfile.length === 0) {
      console.log('Admin profile does not exist, you may need to find the correct user ID');
      console.log('To find user IDs, run: npm run db:list-users');
    } else {
      // Update existing profile
      await db.update(profiles)
        .set({ role: 'admin' })
        .where(eq(profiles.id, 'admin-user-id'));
      console.log('Admin user updated to admin role');
    }
  } catch (error) {
    console.error('Error updating admin user:', error);
  }
}

makeAdmin();