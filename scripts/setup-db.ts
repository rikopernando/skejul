import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import 'dotenv/config';

async function setupDatabase() {
  console.log('Setting up database...');
  
  // Create a client to connect to the database
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Drop existing tables in correct order
    console.log('Dropping existing tables...');
    await client.query(`
      DROP TABLE IF EXISTS swap_requests CASCADE;
      DROP TABLE IF EXISTS announcements CASCADE;
      DROP TABLE IF EXISTS schedule_slots CASCADE;
      DROP TABLE IF EXISTS teachers CASCADE;
      DROP TABLE IF EXISTS subjects CASCADE;
      DROP TABLE IF EXISTS classes CASCADE;
      DROP TABLE IF EXISTS rooms CASCADE;
      DROP TABLE IF EXISTS profiles CASCADE;
      DROP TYPE IF EXISTS request_status CASCADE;
      DROP TYPE IF EXISTS user_role CASCADE;
    `);
    
    // Create enums
    console.log('Creating enums...');
    await client.query(`
      CREATE TYPE user_role AS ENUM ('admin', 'teacher');
      CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
    `);
    
    // Create tables
    console.log('Creating tables...');
    await client.query(`
      -- Create profiles table
      CREATE TABLE profiles (
        id TEXT PRIMARY KEY,
        full_name VARCHAR(256),
        role user_role DEFAULT 'teacher' NOT NULL
      );
      
      -- Create teachers table
      CREATE TABLE teachers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        profile_id TEXT UNIQUE REFERENCES profiles(id),
        name VARCHAR(256) NOT NULL,
        employee_id VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      -- Create subjects table
      CREATE TABLE subjects (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        code VARCHAR(50) UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      -- Create classes table
      CREATE TABLE classes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        grade INTEGER,
        academic_year VARCHAR(9),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      -- Create rooms table
      CREATE TABLE rooms (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        capacity INTEGER,
        location TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      -- Create schedule_slots table
      CREATE TABLE schedule_slots (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        day_of_week INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
        subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE
      );
      
      -- Create announcements table
      CREATE TABLE announcements (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(256) NOT NULL,
        content TEXT NOT NULL,
        author_id TEXT NOT NULL REFERENCES profiles(id),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      -- Create swap_requests table
      CREATE TABLE swap_requests (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        original_slot_id UUID NOT NULL REFERENCES schedule_slots(id),
        requester_id TEXT NOT NULL REFERENCES profiles(id),
        requested_id TEXT NOT NULL REFERENCES profiles(id),
        status request_status DEFAULT 'pending' NOT NULL,
        admin_approval_id TEXT REFERENCES profiles(id),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

// Run the setup function
setupDatabase().catch((error) => {
  console.error('Setup process failed:', error);
});