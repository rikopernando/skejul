import { db } from '@/db';
import { user } from '@/db/schema/auth';

async function checkUsers() {
  try {
    const users = await db.select().from(user);
    console.log('Current users in database:', users.length);
    users.forEach(u => {
      console.log(`- ${u.id}: ${u.name} (${u.email})`);
    });
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();