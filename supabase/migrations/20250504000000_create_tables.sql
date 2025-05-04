
-- Create the tables needed for the FormFillGenie application

-- Personal Data Table
CREATE TABLE IF NOT EXISTS personal_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fullName TEXT,
  fatherName TEXT,
  motherName TEXT,
  dateOfBirth TEXT,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postalCode TEXT,
  school TEXT,
  college TEXT,
  degree TEXT,
  graduationYear TEXT,
  gpa TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on personal_data table
ALTER TABLE personal_data ENABLE ROW LEVEL SECURITY;

-- Create policy for personal_data
CREATE POLICY "Users can only access their own personal data" 
  ON personal_data 
  USING (auth.uid() = user_id);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  fileData TEXT NOT NULL, -- URL to file in storage
  dateAdded TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy for documents
CREATE POLICY "Users can only access their own documents" 
  ON documents 
  USING (auth.uid() = user_id);

-- Form History Table
CREATE TABLE IF NOT EXISTS form_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  website_url TEXT NOT NULL,
  field_name TEXT NOT NULL,
  field_value TEXT,
  field_type TEXT,
  date_filled TIMESTAMP WITH TIME ZONE DEFAULT now(),
  form_title TEXT
);

-- Enable RLS on form_history table
ALTER TABLE form_history ENABLE ROW LEVEL SECURITY;

-- Create policy for form_history
CREATE POLICY "Users can only access their own form history" 
  ON form_history 
  USING (auth.uid() = user_id);

-- Create storage bucket for documents
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Set up storage policy for documents
CREATE POLICY "Users can upload their own documents" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" 
  ON storage.objects 
  FOR UPDATE 
  USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
  ON storage.objects 
  FOR DELETE 
  USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Documents are publicly accessible" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'documents');
