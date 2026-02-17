-- ============================================================
-- Veracity Expert Witness Portal — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- ============================================================
-- 1. TABLES (must come first — functions reference these)
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'expert' CHECK (role IN ('expert', 'admin')),
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  hourly_rate NUMERIC,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'limited', 'unavailable')),
  profile_status TEXT DEFAULT 'pending' CHECK (profile_status IN ('pending', 'approved', 'rejected')),
  invited_at TIMESTAMPTZ,
  onboarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Specialties (the 8 expert categories)
CREATE TABLE specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Expert-Specialty join table
CREATE TABLE expert_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  UNIQUE(expert_id, specialty_id)
);

-- Education
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL DEFAULT '',
  degree TEXT NOT NULL DEFAULT '',
  field_of_study TEXT DEFAULT '',
  start_year INTEGER,
  end_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Work Experience
CREATE TABLE work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Credentials
CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL DEFAULT 'certification' CHECK (credential_type IN ('certification', 'license', 'board_certification', 'other')),
  name TEXT NOT NULL DEFAULT '',
  issuing_body TEXT DEFAULT '',
  issue_date DATE,
  expiry_date DATE,
  credential_number TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Documents (metadata for uploaded files)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('cv', 'license', 'certification', 'sample_report', 'other')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Cases
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  specialty_id UUID REFERENCES specialties(id),
  case_type TEXT DEFAULT '',
  jurisdiction TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Case Invitations
CREATE TABLE case_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'info_requested')),
  expert_notes TEXT,
  invited_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ,
  UNIQUE(case_id, expert_id)
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invitations (tracks sent email invitations)
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invited_by UUID REFERENCES profiles(id),
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. HELPER FUNCTIONS (after tables exist)
-- ============================================================

-- Check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'expert'),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 3. TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin());

-- SPECIALTIES (readable by all authenticated users)
CREATE POLICY "Authenticated users can view specialties" ON specialties FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage specialties" ON specialties FOR ALL USING (is_admin());

-- EXPERT_SPECIALTIES
CREATE POLICY "Experts can view own specialties" ON expert_specialties FOR SELECT USING (auth.uid() = expert_id);
CREATE POLICY "Admins can view all specialties" ON expert_specialties FOR SELECT USING (is_admin());
CREATE POLICY "Experts can manage own specialties" ON expert_specialties FOR INSERT WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts can delete own specialties" ON expert_specialties FOR DELETE USING (auth.uid() = expert_id);
CREATE POLICY "Admins can manage all specialties" ON expert_specialties FOR ALL USING (is_admin());

-- EDUCATION
CREATE POLICY "Experts can view own education" ON education FOR SELECT USING (auth.uid() = expert_id);
CREATE POLICY "Admins can view all education" ON education FOR SELECT USING (is_admin());
CREATE POLICY "Experts can manage own education" ON education FOR INSERT WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts can update own education" ON education FOR UPDATE USING (auth.uid() = expert_id);
CREATE POLICY "Experts can delete own education" ON education FOR DELETE USING (auth.uid() = expert_id);

-- WORK_EXPERIENCE
CREATE POLICY "Experts can view own experience" ON work_experience FOR SELECT USING (auth.uid() = expert_id);
CREATE POLICY "Admins can view all experience" ON work_experience FOR SELECT USING (is_admin());
CREATE POLICY "Experts can manage own experience" ON work_experience FOR INSERT WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts can update own experience" ON work_experience FOR UPDATE USING (auth.uid() = expert_id);
CREATE POLICY "Experts can delete own experience" ON work_experience FOR DELETE USING (auth.uid() = expert_id);

-- CREDENTIALS
CREATE POLICY "Experts can view own credentials" ON credentials FOR SELECT USING (auth.uid() = expert_id);
CREATE POLICY "Admins can view all credentials" ON credentials FOR SELECT USING (is_admin());
CREATE POLICY "Experts can manage own credentials" ON credentials FOR INSERT WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts can update own credentials" ON credentials FOR UPDATE USING (auth.uid() = expert_id);
CREATE POLICY "Experts can delete own credentials" ON credentials FOR DELETE USING (auth.uid() = expert_id);

-- DOCUMENTS
CREATE POLICY "Experts can view own documents" ON documents FOR SELECT USING (auth.uid() = expert_id);
CREATE POLICY "Admins can view all documents" ON documents FOR SELECT USING (is_admin());
CREATE POLICY "Experts can upload documents" ON documents FOR INSERT WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts can delete own documents" ON documents FOR DELETE USING (auth.uid() = expert_id);

-- CASES
CREATE POLICY "Admins can manage cases" ON cases FOR ALL USING (is_admin());
CREATE POLICY "Experts can view cases they're invited to" ON cases FOR SELECT USING (
  EXISTS (SELECT 1 FROM case_invitations WHERE case_id = cases.id AND expert_id = auth.uid())
);

-- CASE_INVITATIONS
CREATE POLICY "Experts can view own invitations" ON case_invitations FOR SELECT USING (auth.uid() = expert_id);
CREATE POLICY "Experts can update own invitations" ON case_invitations FOR UPDATE USING (auth.uid() = expert_id);
CREATE POLICY "Admins can manage all invitations" ON case_invitations FOR ALL USING (is_admin());

-- CONVERSATIONS
CREATE POLICY "Participants can view own conversations" ON conversations FOR SELECT USING (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);
CREATE POLICY "Authenticated users can create conversations" ON conversations FOR INSERT WITH CHECK (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);
CREATE POLICY "Participants can update conversations" ON conversations FOR UPDATE USING (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);

-- MESSAGES
CREATE POLICY "Participants can view conversation messages" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients can mark messages as read" ON messages FOR UPDATE USING (auth.uid() = recipient_id);

-- INVITATIONS (admin only)
CREATE POLICY "Admins can manage invitations" ON invitations FOR ALL USING (is_admin());

-- ============================================================
-- 5. STORAGE
-- ============================================================

-- Create the expert-documents bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'expert-documents',
  'expert-documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Storage policies: experts access own folder, admins access all
CREATE POLICY "Experts can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'expert-documents' AND
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Experts can view own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'expert-documents' AND
  (auth.uid()::text = (string_to_array(name, '/'))[1] OR is_admin())
);

CREATE POLICY "Experts can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'expert-documents' AND
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Admins can access all files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'expert-documents' AND is_admin()
);

-- ============================================================
-- 6. SEED DATA — Specialties
-- ============================================================

INSERT INTO specialties (name, slug) VALUES
  ('Medical & Healthcare', 'medical-healthcare'),
  ('Financial & Accounting', 'financial-accounting'),
  ('Technology & Cyber', 'technology-cyber'),
  ('Construction & Engineering', 'construction-engineering'),
  ('Environmental Science', 'environmental-science'),
  ('Intellectual Property', 'intellectual-property'),
  ('Accident Reconstruction', 'accident-reconstruction'),
  ('Forensic Analysis', 'forensic-analysis');

-- ============================================================
-- 7. REALTIME — Enable on messages table
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================================
-- DONE! Next steps:
-- 1. Add your first admin user in Supabase Auth > Users
-- 2. Run: UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@veracityexpertwitness.com';
-- 3. Configure SMTP in Supabase Auth > Settings for invitation emails
-- 4. Set redirect URLs in Supabase Auth > URL Configuration:
--    - Site URL: https://veracityexpertwitness.com
--    - Redirect URLs: https://veracityexpertwitness.com/portal/auth/callback
-- ============================================================
