-- ============================================================
-- SEED DATA RPC FUNCTION (SECURITY DEFINER)
-- Run this ONCE in Supabase SQL editor after schema-v3.sql
-- This allows the /api/seed endpoint to work with the anon key
-- ============================================================

CREATE OR REPLACE FUNCTION seed_platform_data()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  admin_id UUID;
  tutor_ids UUID[];
  student_ids UUID[];
  parent_id UUID;
BEGIN

  -- Clean existing data (WHERE TRUE required for Supabase safe mode)
  DELETE FROM notifications WHERE TRUE;
  DELETE FROM audit_logs WHERE TRUE;
  DELETE FROM reviews WHERE TRUE;
  DELETE FROM submissions WHERE TRUE; DELETE FROM grades WHERE TRUE;
  DELETE FROM assignment_attachments WHERE TRUE; DELETE FROM assignments WHERE TRUE;
  DELETE FROM progress_records WHERE TRUE; DELETE FROM learning_goals WHERE TRUE;
  DELETE FROM booking_participants WHERE TRUE; DELETE FROM booking_status_history WHERE TRUE;
  DELETE FROM slot_holds WHERE TRUE; DELETE FROM attendance_records WHERE TRUE;
  DELETE FROM session_notes WHERE TRUE; DELETE FROM tutor_product_prices WHERE TRUE;
  DELETE FROM availability_rules WHERE TRUE; DELETE FROM tutor_subjects WHERE TRUE;
  DELETE FROM tutors WHERE TRUE; DELETE FROM guardian_student_links WHERE TRUE;
  DELETE FROM household_members WHERE TRUE; DELETE FROM households WHERE TRUE;
  DELETE FROM admin_permissions WHERE TRUE; DELETE FROM user_sessions WHERE TRUE;
  DELETE FROM consents WHERE TRUE; DELETE FROM bookings WHERE TRUE;
  DELETE FROM contact_messages WHERE TRUE; DELETE FROM teacher_applications WHERE TRUE;
  DELETE FROM favorites WHERE TRUE; DELETE FROM users WHERE TRUE;

  -- 1. Admin
  INSERT INTO users (full_name, email, role, account_status, timezone)
  VALUES ('Admin User', 'admin@tutorconnect.com', 'admin', 'active', 'America/New_York')
  RETURNING id INTO admin_id;
  INSERT INTO admin_permissions (user_id, admin_role) VALUES (admin_id, 'super_admin');

  -- 2. Tutor users + profiles
  WITH tutor_users AS (
    INSERT INTO users (full_name, email, role, account_status) VALUES
      ('Dr. Sarah Chen', 'sarah.chen@tutorconnect.com', 'tutor', 'active'),
      ('Prof. James Wilson', 'james.wilson@tutorconnect.com', 'tutor', 'active'),
      ('Ms. Elena Rodriguez', 'elena.r@tutorconnect.com', 'tutor', 'active'),
      ('Dr. Michael Hart', 'michael.hart@tutorconnect.com', 'tutor', 'active'),
      ('Prof. Alex Rivera', 'alex.rivera@tutorconnect.com', 'tutor', 'active')
    RETURNING id
  )
  SELECT ARRAY_AGG(id) INTO tutor_ids FROM tutor_users;

  INSERT INTO tutors (user_id, bio, experience_years, qualification, hourly_rate, is_approved, languages) VALUES
    (tutor_ids[1], 'PhD in Mathematics from MIT. 15+ years teaching experience.', 15, 'PhD Mathematics, MIT', 65, TRUE, 'English, Mandarin'),
    (tutor_ids[2], 'Full-stack developer and educator. Expert in React, Node.js, Python.', 10, 'MSc Computer Science, Stanford', 55, TRUE, 'English'),
    (tutor_ids[3], 'Native Spanish speaker. Teaching languages for 8 years.', 8, 'MA Linguistics, Barcelona', 45, TRUE, 'Spanish, English, French'),
    (tutor_ids[4], 'PhD in Physics, published researcher. Making science accessible.', 12, 'PhD Physics, Caltech', 60, TRUE, 'English'),
    (tutor_ids[5], 'Software engineer teaching coding to beginners and advanced students.', 7, 'BSc Computer Science, MIT', 50, TRUE, 'English, Hindi');

  -- 3. Subject links
  INSERT INTO tutor_subjects (tutor_id, subject_id)
  SELECT t.id, s.id FROM tutors t JOIN users u ON u.id = t.user_id, subjects s
  WHERE u.email = 'sarah.chen@tutorconnect.com' AND s.name IN ('Mathematics', 'Physics');
  INSERT INTO tutor_subjects (tutor_id, subject_id)
  SELECT t.id, s.id FROM tutors t JOIN users u ON u.id = t.user_id, subjects s
  WHERE u.email = 'james.wilson@tutorconnect.com' AND s.name IN ('Computer Science', 'Coding');
  INSERT INTO tutor_subjects (tutor_id, subject_id)
  SELECT t.id, s.id FROM tutors t JOIN users u ON u.id = t.user_id, subjects s
  WHERE u.email = 'elena.r@tutorconnect.com' AND s.name IN ('English', 'Urdu');
  INSERT INTO tutor_subjects (tutor_id, subject_id)
  SELECT t.id, s.id FROM tutors t JOIN users u ON u.id = t.user_id, subjects s
  WHERE u.email = 'michael.hart@tutorconnect.com' AND s.name IN ('Physics', 'Chemistry', 'Mathematics');
  INSERT INTO tutor_subjects (tutor_id, subject_id)
  SELECT t.id, s.id FROM tutors t JOIN users u ON u.id = t.user_id, subjects s
  WHERE u.email = 'alex.rivera@tutorconnect.com' AND s.name IN ('Computer Science', 'Coding');

  -- 4. Students
  WITH s AS (
    INSERT INTO users (full_name, email, role, account_status) VALUES
      ('Alex Johnson', 'alex.j@example.com', 'student', 'active'),
      ('Maya Rivers', 'maya.r@example.com', 'student', 'active'),
      ('Leo Rivers', 'leo.r@example.com', 'student', 'active')
    RETURNING id
  )
  SELECT ARRAY_AGG(id) INTO student_ids FROM s;

  -- 5. Parent + household
  INSERT INTO users (full_name, email, role, account_status)
  VALUES ('David Rivers', 'david.r@example.com', 'parent', 'active')
  RETURNING id INTO parent_id;

  INSERT INTO households (name, primary_billing_guardian_id) VALUES ('Rivers Family', parent_id);
  INSERT INTO household_members (household_id, user_id, role_in_household)
  SELECT h.id, u.id, CASE WHEN u.id = parent_id THEN 'guardian' ELSE 'student' END
  FROM (SELECT id FROM households LIMIT 1) h, users u
  WHERE u.id IN (parent_id, student_ids[2], student_ids[3]);
  INSERT INTO guardian_student_links (guardian_id, student_id, relationship, is_billing_responsible) VALUES
    (parent_id, student_ids[2], 'Father', TRUE), (parent_id, student_ids[3], 'Father', TRUE);

  -- 6. Bookings
  INSERT INTO bookings (student_id, tutor_id, subject_id, booking_type, scheduled_at, status, student_name)
  SELECT student_ids[1], t.id, s.id, 'trial', NOW() + INTERVAL '2 days', 'confirmed', 'Alex Johnson'
  FROM tutors t, subjects s WHERE t.user_id = (SELECT id FROM users WHERE email = 'sarah.chen@tutorconnect.com') AND s.name = 'Mathematics' LIMIT 1;

  INSERT INTO bookings (student_id, tutor_id, subject_id, booking_type, scheduled_at, status, student_name)
  SELECT student_ids[2], t.id, s.id, 'paid', NOW() + INTERVAL '5 days', 'confirmed', 'Maya Rivers'
  FROM tutors t, subjects s WHERE t.user_id = (SELECT id FROM users WHERE email = 'michael.hart@tutorconnect.com') AND s.name = 'Physics' LIMIT 1;

  -- 7. Learning goals
  INSERT INTO learning_goals (student_id, title, target_date, status, progress_pct) VALUES
    (student_ids[1], 'Ace SAT Math', '2026-12-15', 'active', 65),
    (student_ids[1], 'Complete AP Calculus', '2027-03-01', 'active', 30),
    (student_ids[2], 'Master Quantum Physics', '2026-11-01', 'active', 45),
    (student_ids[3], 'Improve Creative Writing', '2026-12-01', 'active', 70);

  -- 8. Progress
  INSERT INTO progress_records (student_id, metric_type, metric_value, notes) VALUES
    (student_ids[1], 'hours_studied', 24.5, 'This month'),
    (student_ids[1], 'avg_score', 87, 'Average score'),
    (student_ids[2], 'hours_studied', 18.5, 'This month'),
    (student_ids[2], 'avg_score', 92, 'Average score');

  -- 9. Reviews
  INSERT INTO reviews (student_id, tutor_id, rating, comment, is_approved)
  SELECT student_ids[1], t.id, 5, 'Dr. Chen is an amazing tutor!', TRUE
  FROM tutors t WHERE t.user_id = (SELECT id FROM users WHERE email = 'sarah.chen@tutorconnect.com') LIMIT 1;

  INSERT INTO reviews (student_id, tutor_id, rating, comment, is_approved)
  SELECT student_ids[2], t.id, 4, 'Great tutor! Helped me understand physics.', TRUE
  FROM tutors t WHERE t.user_id = (SELECT id FROM users WHERE email = 'michael.hart@tutorconnect.com') LIMIT 1;

  -- 10. Notifications
  INSERT INTO notifications (user_id, type, title, body) VALUES
    (student_ids[1], 'booking_confirmed', 'Lesson Confirmed!', 'Your trial session is confirmed.'),
    (tutor_ids[1], 'new_booking', 'New Booking', 'A student booked a session.'),
    (parent_id, 'booking_confirmed', 'Lesson Booked for Maya', 'Maya has a Physics lesson confirmed.'),
    (student_ids[2], 'assignment_due', 'Assignment Due', 'Your Physics Lab Report is due soon.');

  -- 11. Audit logs
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES
    (admin_id, 'admin_session_started', 'session', 'sess_001'),
    (admin_id, 'tutor_approved', 'tutor', (SELECT id::text FROM tutors LIMIT 1)),
    (admin_id, 'payment_received', 'payment', 'pay_001');

  result := jsonb_build_object(
    'success', TRUE,
    'tutors', (SELECT COUNT(*) FROM tutors),
    'students', (SELECT COUNT(*) FROM users WHERE role = 'student'),
    'bookings', (SELECT COUNT(*) FROM bookings),
    'goals', (SELECT COUNT(*) FROM learning_goals),
    'reviews', (SELECT COUNT(*) FROM reviews)
  );
  RETURN result;
END;
$$;
