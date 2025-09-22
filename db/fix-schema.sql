-- First, let's check what tables exist and their schemas
\dt

-- If the announcements table exists with a different schema, we need to drop it
DROP TABLE IF EXISTS announcements CASCADE;

-- Now let's recreate it with the correct schema
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(256) NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);