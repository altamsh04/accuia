-- Create projects table with encrypted database credentials
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Encrypted database connection details
    encrypted_db_user TEXT NOT NULL,
    encrypted_db_password TEXT NOT NULL,
    encrypted_db_host TEXT NOT NULL,
    encrypted_db_port TEXT NOT NULL,
    encrypted_db_name TEXT NOT NULL,
    encrypted_table_name TEXT NOT NULL,
    
    -- Gemini AI configuration
    encrypted_gemini_api_key TEXT NOT NULL,
    gemini_model VARCHAR(50) NOT NULL,
    
    -- Database context from API response
    db_context JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for better performance
    CONSTRAINT projects_user_id_idx UNIQUE (user_id, id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to ensure users can only access their own projects
CREATE POLICY "Users can only access their own projects" ON projects
    FOR ALL USING (auth.uid() = user_id);
