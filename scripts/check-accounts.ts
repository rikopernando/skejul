import { db } from '@/db';
import { user, account } from '@/db/schema/auth';

async function checkAccounts() {
  try {
    const accounts = await db.select().from(account);
    console.log('Current accounts in database:', accounts.length);
    accounts.forEach(a => {
      console.log(`- ${a.id}: ${a.accountId} (${a.providerId}) - has password: ${!!a.password}`);
    });
  } catch (error) {
    console.error('Error checking accounts:', error);
  }
}

checkAccounts();