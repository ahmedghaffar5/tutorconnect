-- ============================================================
-- TUTORCONNECT v3 SEED DATA
-- ============================================================

-- Create auth users first (these would normally be created via Supabase Auth)
-- We seed the public.users table directly for demo purposes

-- Admins
INSERT INTO users (id, full_name, email, role, account_status, timezone) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Admin User', 'admin@tutorconnect.com', 'admin', 'active', 'America/New_York'),
  ('a0000000-0000-0000-0000-000000000002', 'Sarah Review', 'sarah@tutorconnect.com', 'admin', 'active', 'America/New_York');

INSERT INTO admin_permissions (user_id, admin_role) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'super_admin'),
  ('a0000000-0000-0000-0000-000000000002', 'tutor_reviewer');

-- Tutors (approved)
INSERT INTO users (id, full_name, email, role, account_status, timezone) VALUES
  ('t0000000-0000-0000-0000-000000000001', 'Dr. Sarah Chen', 'sarah.chen@tutorconnect.com', 'tutor', 'active', 'America/New_York'),
  ('t0000000-0000-0000-0000-000000000002', 'Prof. James Wilson', 'james.wilson@tutorconnect.com', 'tutor', 'active', 'America/Los_Angeles'),
  ('t0000000-0000-0000-0000-000000000003', 'Ms. Elena Rodriguez', 'elena.r@tutorconnect.com', 'tutor', 'active', 'America/Chicago'),
  ('t0000000-0000-0000-0000-000000000004', 'Dr. Michael Hart', 'michael.hart@tutorconnect.com', 'tutor', 'active', 'America/New_York'),
  ('t0000000-0000-0000-0000-000000000005', 'Prof. Alex Rivera', 'alex.rivera@tutorconnect.com', 'tutor', 'active', 'America/Denver');

INSERT INTO tutors (id, user_id, bio, experience_years, qualification, hourly_rate, is_approved, languages) VALUES
  ('t1000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000001', 'PhD in Mathematics from MIT. 15+ years teaching experience. Specializing in calculus, linear algebra, and statistics.', 15, 'PhD Mathematics, MIT', 65, TRUE, 'English, Mandarin'),
  ('t1000000-0000-0000-0000-000000000002', 't0000000-0000-0000-0000-000000000002', 'Full-stack developer and educator. Expert in React, Node.js, Python, and system design.', 10, 'MSc Computer Science, Stanford', 55, TRUE, 'English'),
  ('t1000000-0000-0000-0000-000000000003', 't0000000-0000-0000-0000-000000000003', 'Native Spanish speaker with MA in Linguistics. Teaching Spanish, English, and French for 8 years.', 8, 'MA Linguistics, Universidad de Barcelona', 45, TRUE, 'Spanish, English, French'),
  ('t1000000-0000-0000-0000-000000000004', 't0000000-0000-0000-0000-000000000005', 'Passionate about making science accessible. PhD in Physics, published researcher.', 12, 'PhD Physics, Caltech', 60, TRUE, 'English'),
  ('t1000000-0000-0000-0000-000000000005', 't0000000-0000-0000-0000-000000000003', 'Software engineer teaching coding to beginners and advanced students alike.', 7, 'BSc Computer Science, MIT', 50, TRUE, 'English, Hindi');

-- Tutor subjects
INSERT INTO tutor_subjects (tutor_id, subject_id) 
SELECT t.id, s.id FROM tutors t, subjects s WHERE t.user_id = 't0000000-0000-0000-0000-000000000001' AND s.name IN ('Mathematics', 'Physics');
INSERT INTO tutor_subjects (tutor_id, subject_id)
SELECT t.id, s.id FROM tutors t, subjects s WHERE t.user_id = 't0000000-0000-0000-0000-000000000002' AND s.name IN ('Computer Science', 'Coding');
INSERT INTO tutor_subjects (tutor_id, subject_id)
SELECT t.id, s.id FROM tutors t, subjects s WHERE t.user_id = 't0000000-0000-0000-0000-000000000003' AND s.name IN ('English', 'Urdu');
INSERT INTO tutor_subjects (tutor_id, subject_id)
SELECT t.id, s.id FROM tutors t, subjects s WHERE t.user_id = 't0000000-0000-0000-0000-000000000004' AND s.name IN ('Physics', 'Chemistry', 'Mathematics');
INSERT INTO tutor_subjects (tutor_id, subject_id)
SELECT t.id, s.id FROM tutors t, subjects s WHERE t.user_id = 't0000000-0000-0000-0000-000000000005' AND s.name IN ('Computer Science', 'Coding');

-- Tutor availability
INSERT INTO availability_rules (tutor_id, day_of_week, start_time, end_time)
SELECT t.id, d, '09:00'::time, '17:00'::time
FROM tutors t CROSS JOIN (VALUES (0),(1),(2),(3),(4),(5)) AS days(d)
WHERE t.user_id = 't0000000-0000-0000-0000-000000000001';

-- Lesson products
INSERT INTO lesson_products (name, description, duration_minutes, session_count, is_trial, sort_order) VALUES
  ('Trial Session', '30-minute introductory session', 30, 1, TRUE, 0),
  ('Standard Session', '60-minute one-on-one tutoring session', 60, 1, FALSE, 1),
  ('5-Session Pack', '5 standard sessions at a discounted rate', 60, 5, FALSE, 2),
  ('10-Session Pack', '10 standard sessions with maximum savings', 60, 10, FALSE, 3);

-- Tutor pricing
INSERT INTO tutor_product_prices (tutor_id, product_id, price)
SELECT t.id, p.id, CASE 
  WHEN p.is_trial THEN 0
  WHEN p.session_count = 1 THEN t.hourly_rate
  WHEN p.session_count = 5 THEN t.hourly_rate * 4.5
  WHEN p.session_count = 10 THEN t.hourly_rate * 8
END
FROM tutors t CROSS JOIN lesson_products p
WHERE t.is_approved = TRUE;

-- Students
INSERT INTO users (id, full_name, email, role, account_status) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'Alex Johnson', 'alex.j@example.com', 'student', 'active'),
  ('s0000000-0000-0000-0000-000000000002', 'Maya Rivers', 'maya.r@example.com', 'student', 'active'),
  ('s0000000-0000-0000-0000-000000000003', 'Leo Rivers', 'leo.r@example.com', 'student', 'active');

-- Parents
INSERT INTO users (id, full_name, email, role, account_status) VALUES
  ('p0000000-0000-0000-0000-000000000001', 'David Rivers', 'david.r@example.com', 'parent', 'active');

-- Household
INSERT INTO households (id, name, primary_billing_guardian_id) VALUES
  ('h0000000-0000-0000-0000-000000000001', 'Rivers Family', 'p0000000-0000-0000-0000-000000000001');

INSERT INTO household_members (household_id, user_id, role_in_household) VALUES
  ('h0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'guardian'),
  ('h0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000002', 'student'),
  ('h0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000003', 'student');

INSERT INTO guardian_student_links (guardian_id, student_id, relationship, is_billing_responsible) VALUES
  ('p0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000002', 'Father', TRUE),
  ('p0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000003', 'Father', TRUE);

-- Bookings
INSERT INTO bookings (student_id, tutor_id, subject_id, booking_type, scheduled_at, status, student_name, booking_mode)
SELECT 
  's0000000-0000-0000-0000-000000000001',
  t.id,
  s.id,
  'trial',
  NOW() + INTERVAL '2 days',
  'confirmed',
  'Alex Johnson',
  'instant'
FROM tutors t, subjects s 
WHERE t.user_id = 't0000000-0000-0000-0000-000000000001' AND s.name = 'Mathematics'
LIMIT 1;

INSERT INTO bookings (student_id, tutor_id, subject_id, booking_type, scheduled_at, status, student_name, booking_mode)
SELECT 
  's0000000-0000-0000-0000-000000000002',
  t.id,
  s.id,
  'paid',
  NOW() + INTERVAL '5 days',
  'confirmed',
  'Maya Rivers',
  'instant'
FROM tutors t, subjects s 
WHERE t.user_id = 't0000000-0000-0000-0000-000000000004' AND s.name = 'Physics'
LIMIT 1;

INSERT INTO bookings (student_id, tutor_id, subject_id, booking_type, scheduled_at, status, student_name, booking_mode)
SELECT 
  's0000000-0000-0000-0000-000000000003',
  t.id,
  s.id,
  'paid',
  NOW() + INTERVAL '7 days',
  'pending',
  'Leo Rivers',
  'tutor_approval'
FROM tutors t, subjects s 
WHERE t.user_id = 't0000000-0000-0000-0000-000000000003' AND s.name = 'English'
LIMIT 1;

-- Booking participants
INSERT INTO booking_participants (booking_id, user_id, role)
SELECT b.id, b.student_id, 'student' FROM bookings b;
INSERT INTO booking_participants (booking_id, user_id, role)
SELECT b.id, t.user_id, 'tutor' FROM bookings b JOIN tutors t ON t.id = b.tutor_id;

-- Learning goals
INSERT INTO learning_goals (student_id, title, target_date, status, progress_pct) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'Ace SAT Math', '2026-12-15', 'active', 65),
  ('s0000000-0000-0000-0000-000000000001', 'Complete AP Calculus', '2027-03-01', 'active', 30),
  ('s0000000-0000-0000-0000-000000000002', 'Master Quantum Physics Basics', '2026-11-01', 'active', 45),
  ('s0000000-0000-0000-0000-000000000003', 'Improve Creative Writing', '2026-12-01', 'active', 70);

-- Progress records
INSERT INTO progress_records (student_id, metric_type, metric_value, notes) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'hours_studied', 24.5, 'Total study hours this month'),
  ('s0000000-0000-0000-0000-000000000001', 'avg_score', 87, 'Average assessment score'),
  ('s0000000-0000-0000-0000-000000000001', 'sessions_completed', 12, 'Completed tutoring sessions'),
  ('s0000000-0000-0000-0000-000000000002', 'hours_studied', 18.5, 'Total study hours this month'),
  ('s0000000-0000-0000-0000-000000000002', 'avg_score', 92, 'Average assessment score');

-- Assignments
INSERT INTO assignments (tutor_id, student_id, title, description, due_at, status, max_score)
SELECT t.id, 's0000000-0000-0000-0000-000000000001', 'Calculus Problem Set #4', 'Derivatives and applications', NOW() + INTERVAL '7 days', 'assigned', 100
FROM tutors t WHERE t.user_id = 't0000000-0000-0000-0000-000000000001' LIMIT 1;

INSERT INTO assignments (tutor_id, student_id, title, description, due_at, status, max_score)
SELECT t.id, 's0000000-0000-0000-0000-000000000002', 'Physics Lab Report', 'Quantum mechanics experiment analysis', NOW() + INTERVAL '14 days', 'assigned', 100
FROM tutors t WHERE t.user_id = 't0000000-0000-0000-0000-000000000004' LIMIT 1;

-- Reviews
INSERT INTO reviews (student_id, tutor_id, rating, comment, is_approved)
SELECT 's0000000-0000-0000-0000-000000000001', t.id, 5, 'Dr. Chen is an amazing tutor! She explains complex concepts clearly and patiently.', TRUE
FROM tutors t WHERE t.user_id = 't0000000-0000-0000-0000-000000000001' LIMIT 1;

INSERT INTO reviews (student_id, tutor_id, rating, comment, is_approved)
SELECT 's0000000-0000-0000-0000-000000000002', t.id, 4, 'Great tutor! Helped me understand physics concepts I was struggling with.', TRUE
FROM tutors t WHERE t.user_id = 't0000000-0000-0000-0000-000000000004' LIMIT 1;

-- Audit logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin_session_started', 'session', 'sess_001', '{"ip": "192.168.1.1"}'),
  ('a0000000-0000-0000-0000-000000000002', 'application_approved', 'application', 'app_001', '{"tutor": "Dr. Sarah Chen"}'),
  ('a0000000-0000-0000-0000-000000000001', 'system_update_applied', 'system', 'v3.0.0', '{"version": "3.0.0"}'),
  ('a0000000-0000-0000-0000-000000000002', 'tutor_approved', 'tutor', 't_001', '{"tutor_id": "t0000000-0000-0000-0000-000000000001"}'),
  ('a0000000-0000-0000-0000-000000000001', 'payment_received', 'payment', 'pay_001', '{"amount": 65.00, "booking_id": "b_001"}');

-- Feature flags
INSERT INTO feature_flags (key, value, description) VALUES
  ('operating_mode', 'booking_payment', 'Current platform mode: inquiry, booking, or booking_payment')
ON CONFLICT (key) DO UPDATE SET value = 'booking_payment';

-- Notifications
INSERT INTO notifications (user_id, type, title, body, data) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'booking_confirmed', 'Lesson Confirmed!', 'Your trial lesson with Dr. Sarah Chen is confirmed for this Thursday.', '{"booking_id": "b_001"}'),
  ('t0000000-0000-0000-0000-000000000001', 'new_booking', 'New Booking Request', 'Alex Johnson has booked a trial session with you.', '{"booking_id": "b_001"}'),
  ('p0000000-0000-0000-0000-000000000001', 'booking_confirmed', 'Lesson Booked for Maya', 'Maya has a Physics lesson confirmed for this weekend.', '{"booking_id": "b_002"}'),
  ('s0000000-0000-0000-0000-000000000002', 'assignment_due', 'Assignment Due Soon', 'Your Physics Lab Report is due in 7 days.', '{"assignment_id": "a_002"}');

-- Contact messages
INSERT INTO contact_messages (name, email, message) VALUES
  ('Jane Smith', 'jane.smith@example.com', 'I am interested in learning Python programming. Do you have tutors available for beginners?'),
  ('Tom Brown', 'tom.b@example.com', 'What are your cancellation policies for monthly packages?');
