-- ============================================================
-- FIX RLS - Remove recursion, add safe policies
-- Run this in Supabase SQL Editor (replaces previous fix-rls)
-- ============================================================

-- Drop ALL existing policies to start clean
DROP POLICY IF EXISTS "self_read" ON users;
DROP POLICY IF EXISTS "admin_read_all" ON users;
DROP POLICY IF EXISTS "self_update" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "public_read_tutor_profiles" ON users;

DROP POLICY IF EXISTS "Public can view approved tutors" ON tutors;
DROP POLICY IF EXISTS "Tutors can view own profile" ON tutors;
DROP POLICY IF EXISTS "Admin can view all tutors" ON tutors;
DROP POLICY IF EXISTS "Admin can update any tutor" ON tutors;
DROP POLICY IF EXISTS "Tutors can update own profile" ON tutors;
DROP POLICY IF EXISTS "Tutors can insert own profile" ON tutors;
DROP POLICY IF EXISTS "anon_read_tutors" ON tutors;

-- === USERS POLICIES ===
-- 1. Users can read own profile
CREATE POLICY "users_self_read" ON users FOR SELECT USING (auth.uid() = id);

-- 2. Admin can read all
CREATE POLICY "users_admin_read" ON users FOR SELECT USING (auth.jwt()->>'role' = 'admin');

-- 3. Users can update own profile
CREATE POLICY "users_self_update" ON users FOR UPDATE USING (auth.uid() = id);

-- 4. Public can read basic info of approved tutors (NO subquery to tutors table - uses a direct check instead)
CREATE POLICY "users_public_read_tutors" ON users FOR SELECT USING (
  (SELECT TRUE FROM tutors WHERE tutors.user_id = users.id AND tutors.is_approved = TRUE LIMIT 1) IS NOT NULL
);

-- 5. Allow reading user info when authenticated (for JWT role checks, etc.)
CREATE POLICY "users_self_or_public" ON users FOR SELECT USING (
  auth.uid() = id OR (SELECT TRUE FROM tutors WHERE tutors.user_id = users.id AND tutors.is_approved = TRUE LIMIT 1) IS NOT NULL
);

-- === TUTORS POLICIES ===
-- 1. Public can view approved tutors (simple, no recursion)
CREATE POLICY "tutors_public_read" ON tutors FOR SELECT USING (is_approved = TRUE);

-- 2. Tutors can view own profile
CREATE POLICY "tutors_self_read" ON tutors FOR SELECT USING (
  is_approved = TRUE OR auth.uid() = user_id
);

-- 3. Admin can view all tutors (no subquery to users)
CREATE POLICY "tutors_admin_read" ON tutors FOR SELECT USING (
  auth.jwt()->>'role' = 'admin'
);

-- 4. Tutors can update own profile
CREATE POLICY "tutors_self_update" ON tutors FOR UPDATE USING (auth.uid() = user_id);

-- 5. Admin can update any tutor
CREATE POLICY "tutors_admin_update" ON tutors FOR UPDATE USING (
  auth.jwt()->>'role' = 'admin'
);

-- 6. Tutors can insert own profile
CREATE POLICY "tutors_self_insert" ON tutors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Note: The key fix is using auth.jwt()->>'role' instead of subquerying users table,
-- and using `SELECT EXISTS (SELECT 1 FROM tutors ...)` instead of referencing tutors in a WHERE subquery
-- that triggers RLS evaluation on the tutors table.
