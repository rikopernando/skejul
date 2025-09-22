import { auth } from '@/lib/auth';

async function createUsersWithSignUpEmail() {
  console.log('Creating users with signUpEmail...');
  
  try {
    // Create admin user
    console.log('Creating admin user...');
    const adminResult = await auth.api.signUpEmail({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User'
    });
    
    console.log('Admin user created:', adminResult);
    
    // Create teacher users
    const teachers = [
      { email: 'john.doe@example.com', name: 'John Doe' },
      { email: 'jane.smith@example.com', name: 'Jane Smith' },
      { email: 'robert.johnson@example.com', name: 'Robert Johnson' },
      { email: 'emily.davis@example.com', name: 'Emily Davis' },
      { email: 'michael.wilson@example.com', name: 'Michael Wilson' }
    ];
    
    for (const teacher of teachers) {
      console.log(`Creating teacher: ${teacher.name}...`);
      const result = await auth.api.signUpEmail({
        email: teacher.email,
        password: 'teacher123',
        name: teacher.name
      });
      
      console.log(`Teacher ${teacher.name} created:`, result);
    }
    
    console.log('All users created successfully!');
  } catch (error) {
    console.error('Error creating users:', error);
  }
}

createUsersWithSignUpEmail();