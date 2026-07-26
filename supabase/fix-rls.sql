-- ============================================================
-- FIX RLS POLICIES for public tutor/subject reading
-- Run this in Supabase SQL Editor
-- ============================================================

-- Allow public read of tutor user profiles (name + email for tutors only)
DROP POLICY IF EXISTS "public_read_tutor_profiles" ON users;
CREATE POLICY "public_read_tutor_profiles" ON users
  FOR SELECT USING (
    -- Allow reading own profile, admin, or public tutor profiles
    auth.uid() = id OR 
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM tutors WHERE tutors.user_id = users.id AND tutors.is_approved = TRUE)
  );

-- Also add: allow anon to read tutor email (needed for the API join)
DROP POLICY IF EXISTS "anon_read_tutors" ON tutors;
CREATE POLICY "anon_read_tutors" ON tutors
  FOR SELECT USING (is_approved = TRUE);
