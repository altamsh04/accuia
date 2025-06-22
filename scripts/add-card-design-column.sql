-- Add card_design column to projects table
ALTER TABLE projects 
ADD COLUMN card_design JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN projects.card_design IS 'Stores user-defined card layout preferences for query results';

-- Create index for better performance when querying card designs
CREATE INDEX IF NOT EXISTS idx_projects_card_design ON projects USING GIN (card_design);
