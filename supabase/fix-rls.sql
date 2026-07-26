-- ============================================================
-- FIX RLS v3 - Drop ALL policies, recreate only simple ones
-- No subqueries between users/tutors tables!
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Drop ALL existing policies on users and tutors
DROP POLICY IF EXISTS "self_read" ON users;
DROP POLICY IF EXISTS "admin_read_all" ON users;
DROP POLICY IF EXISTS "self_update" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "users_self_read" ON users;
DROP POLICY IF EXISTS "users_admin_read" ON users;
DROP POLICY IF EXISTS "users_self_update" ON users;
DROP POLICY IF EXISTS "users_public_read_tutors" ON users;
DROP POLICY IF EXISTS "users_self_or_public" ON users;

DROP POLICY IF EXISTS "Public can view approved tutors" ON tutors;
DROP POLICY IF EXISTS "Tutors can view own profile" ON tutors;
DROP POLICY IF EXISTS "Admin can view all tutors" ON tutors;
DROP POLICY IF EXISTS "Admin can update any tutor" ON tutors;
DROP POLICY IF EXISTS "Tutors can update own profile" ON tutors;
DROP POLICY IF EXISTS "Tutors can insert own profile" ON tutors;
DROP POLICY IF EXISTS "tutors_public_read" ON tutors;
DROP POLICY IF EXISTS "tutors_self_read" ON tutors;
DROP POLICY IF EXISTS "tutors_admin_read" ON tutors;
DROP POLICY IF EXISTS "tutors_self_update" ON tutors;
DROP POLICY IF EXISTS "tutors_admin_update" ON tutors;
DROP POLICY IF EXISTS "tutors_self_insert" ON tutors;

-- Step 2: Users - simple policies (NO subqueries to tutors)
-- Self read
CREATE POLICY "users_self" ON users FOR SELECT USING (auth.uid() = id);
-- Admin read
CREATE POLICY "users_admin" ON users FOR SELECT USING (auth.role() = 'service_role');
-- Self update
CREATE POLICY "users_update" ON users FOR UPDATE USING (auth.uid() = id);

-- Step 3: Tutors - simple policies (NO subqueries to users)
-- Public can view approved (using auth.jwt() instead of subquery)
CREATE POLICY "tutors_public" ON tutors FOR SELECT USING (is_approved = TRUE);
-- Self view
CREATE POLICY "tutors_self" ON tutors FOR SELECT USING (auth.uid() = user_id);
-- Self update
CREATE POLICY "tutors_update" ON tutors FOR UPDATE USING (auth.uid() = user_id);
-- Self insert
CREATE POLICY "tutors_insert" ON tutors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Step 4: Add display_name to tutors table for public API (no join needed)
ALTER TABLE tutors ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Step 5: Update existing tutors with names from users table
UPDATE tutors t SET display_name = u.full_name 
FROM users u WHERE t.user_id = u.id AND t.display_name IS NULL;
