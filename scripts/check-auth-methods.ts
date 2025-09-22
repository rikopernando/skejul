import { auth } from '@/lib/auth';

async function checkAuthMethods() {
  console.log('Checking auth methods...');
  console.log('Auth object keys:', Object.keys(auth));
  console.log('Auth api keys:', Object.keys(auth.api || {}));
  
  // Check if there's a signUp method
  if (auth.signUp) {
    console.log('signUp method exists');
  } else {
    console.log('signUp method does not exist');
  }
  
  // Check if there's an api.signUp method
  if (auth.api && auth.api.signUp) {
    console.log('api.signUp method exists');
  } else {
    console.log('api.signUp method does not exist');
  }
}

checkAuthMethods();