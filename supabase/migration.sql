-- ============================================================
-- TUTORCONNECT v2 FULL MIGRATION
-- ============================================================

-- Update users table: add admin_role for granular permissions
ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_role TEXT CHECK (admin_role IN ('super_admin', 'reviewer', 'support', 'finance', 'content', 'ops'));

-- ============================================================
-- TEACHER APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS teacher_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Step 1: Personal Info
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  country TEXT DEFAULT '',
  date_of_birth DATE,
  gender TEXT,

  -- Step 2: Qualifications
  qualification TEXT DEFAULT '',
  institution TEXT DEFAULT '',
  graduation_year INTEGER,
  specialization TEXT DEFAULT '',
  years_experience INTEGER DEFAULT 0,
  teaching_certificates TEXT DEFAULT '',
  other_certifications TEXT DEFAULT '',

  -- Step 3: Subjects & Rates
  subjects_taught TEXT[] DEFAULT '{}',
  hourly_rate NUMERIC(10,2) DEFAULT 0,
  monthly_rate NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  languages TEXT DEFAULT 'English',

  -- Step 4: Bio & Media
  bio TEXT DEFAULT '',
  profile_image_url TEXT DEFAULT '',
  intro_video_url TEXT DEFAULT '',
  availability TEXT DEFAULT '',

  -- Step 5: References
  reference_name TEXT DEFAULT '',
  reference_contact TEXT DEFAULT '',
  reference_relationship TEXT DEFAULT '',

  -- Application Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'more_info_requested', 'interview_scheduled', 'approved', 'rejected', 'suspended')),
  reviewer_id UUID REFERENCES users(id),
  review_notes TEXT DEFAULT '',
  rejection_reason TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE teacher_applications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- APPLICATION DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES teacher_applications(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ADMIN NOTES (internal review notes)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES teacher_applications(id) ON DELETE CASCADE NOT NULL,
  admin_id UUID REFERENCES users(id) NOT NULL,
  note TEXT NOT NULL,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'review', 'interview', 'decision')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FAVORITES (students save tutors)
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tutor_id UUID REFERENCES tutors(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tutor_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FEATURE FLAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT 'disabled',
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Insert default feature flags
INSERT INTO feature_flags (key, value, description) VALUES
  ('operating_mode', 'booking', 'inquiry, booking, booking_payment'),
  ('teacher_applications', 'enabled', 'enabled, disabled'),
  ('reviews', 'enabled', 'enabled, disabled'),
  ('public_registration', 'enabled', 'enabled, disabled')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Teacher Applications: owner can CRUD, admin roles can read/write
DROP POLICY IF EXISTS "Users can view own applications" ON teacher_applications;
DROP POLICY IF EXISTS "Users can insert own application" ON teacher_applications;
DROP POLICY IF EXISTS "Users can update own draft" ON teacher_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON teacher_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON teacher_applications;

CREATE POLICY "Users can view own applications" ON teacher_applications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own application" ON teacher_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own draft" ON teacher_applications
  FOR UPDATE USING (auth.uid() = user_id AND status = 'draft');
CREATE POLICY "Admins can view all applications" ON teacher_applications
  FOR SELECT USING (auth.jwt()->'user_metadata'->>'role' IN ('admin', 'reviewer', 'support', 'finance', 'content', 'ops'));
CREATE POLICY "Admins can update applications" ON teacher_applications
  FOR UPDATE USING (auth.jwt()->'user_metadata'->>'role' IN ('admin', 'reviewer', 'support', 'finance', 'content', 'ops'));

-- Application Documents
DROP POLICY IF EXISTS "Users can view own documents" ON application_documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON application_documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON application_documents;

CREATE POLICY "Users can view own documents" ON application_documents
  FOR SELECT USING (EXISTS (SELECT 1 FROM teacher_applications WHERE id = application_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own documents" ON application_documents
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM teacher_applications WHERE id = application_id AND user_id = auth.uid()));
CREATE POLICY "Admins can view all documents" ON application_documents
  FOR SELECT USING (auth.jwt()->'user_metadata'->>'role' IN ('admin', 'reviewer', 'support', 'finance', 'content', 'ops'));

-- Admin Notes
DROP POLICY IF EXISTS "Admins can manage notes" ON admin_notes;

CREATE POLICY "Admins can manage notes" ON admin_notes
  FOR ALL USING (auth.jwt()->'user_metadata'->>'role' IN ('admin', 'reviewer', 'support', 'finance', 'content', 'ops'));

-- Audit Logs: admins only
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;

CREATE POLICY "Admins can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (auth.jwt()->'user_metadata'->>'role' IN ('admin', 'reviewer', 'support', 'finance', 'content', 'ops'));

-- Favorites
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Feature Flags: admin read/write, public read
DROP POLICY IF EXISTS "Public can view feature flags" ON feature_flags;
DROP POLICY IF EXISTS "Admins can manage feature flags" ON feature_flags;

CREATE POLICY "Public can view feature flags" ON feature_flags
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage feature flags" ON feature_flags
  FOR ALL USING (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- ============================================================
-- STORAGE BUCKET for application documents
-- ============================================================
-- NOTE: Run this in Supabase Storage UI or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('application_docs', 'application_docs', true);
-- Then create policy: (bucket_id = 'application_docs'::text) for insert with (auth.role() = 'authenticated')
