import { auth } from '@/lib/auth';

async function testSignIn() {
  try {
    console.log('Testing sign in...');
    
    // Try to sign in with admin credentials
    const result = await auth.api.signIn({
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    console.log('Sign in result:', result);
  } catch (error) {
    console.error('Sign in error:', error);
  }
}

testSignIn();