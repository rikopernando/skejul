import { db } from '@/db';
import { account } from '@/db/schema/auth';
import bcrypt from 'bcrypt';

async function testPassword() {
  try {
    // Test password hashing
    const password = 'admin123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('Original password:', password);
    console.log('Hashed password:', hashedPassword);
    
    // Test if the password matches
    const isAdminPassword = await bcrypt.compare(password, hashedPassword);
    console.log('Password matches:', isAdminPassword);
    
    // Check one of our admin accounts
    const adminAccount = await db.select().from(account).where(account.accountId === 'admin@example.com');
    if (adminAccount.length > 0) {
      console.log('Admin account password hash:', adminAccount[0].password);
      const isAdminPasswordValid = await bcrypt.compare(password, adminAccount[0].password || '');
      console.log('Admin password valid:', isAdminPasswordValid);
    }
  } catch (error) {
    console.error('Error testing password:', error);
  }
}

testPassword();