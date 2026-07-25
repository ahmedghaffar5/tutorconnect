-- ============================================================
-- TUTORCONNECT v3 SEED DATA
-- Run AFTER schema-v3.sql
-- ============================================================

-- Clear existing data for clean reseed
DELETE FROM notifications;
DELETE FROM audit_logs;
DELETE FROM reviews;
DELETE FROM submissions;
DELETE FROM grades;
DELETE FROM assignment_attachments;
DELETE FROM assignments;
DELETE FROM progress_records;
DELETE FROM learning_goals;
DELETE FROM booking_participants;
DELETE FROM booking_status_history;
DELETE FROM reschedule_requests;
DELETE FROM cancellation_requests;
DELETE FROM slot_holds;
DELETE FROM attendance_records;
DELETE FROM session_notes;
DELETE FROM tutor_product_prices;
DELETE FROM lesson_products;
DELETE FROM availability_rules;
DELETE FROM availability_exceptions;
DELETE FROM tutor_status_history;
DELETE FROM verification_checks;
DELETE FROM tutor_levels;
DELETE FROM tutor_curricula;
DELETE FROM tutor_subjects;
DELETE FROM tutors;
DELETE FROM guardian_student_links;
DELETE FROM household_members;
DELETE FROM households;
DELETE FROM admin_permissions;
DELETE FROM contact_messages;
DELETE FROM conversation_participants;
DELETE FROM messages;
DELETE FROM conversations;
DELETE FROM notification_preferences;
DELETE FROM support_cases;
DELETE FROM safeguarding_cases;
DELETE FROM webhook_events;
DELETE FROM user_sessions;
DELETE FROM consents;
DELETE FROM users;

-- ============================================================
-- ADMINS
-- ============================================================
INSERT INTO users (id, full_name, email, role, account_status, timezone) VALUES
  (gen_random_uuid(), 'Admin User', 'admin@tutorconnect.com', 'admin', 'active', 'America/New_York'),
  (gen_random_uuid(), 'Sarah Review', 'sarah.review@tutorconnect.com', 'admin', 'active', 'America/New_York');

-- Grant admin permissions
INSERT INTO admin_permissions (user_id, admin_role)
SELECT id, 'super_admin' FROM users WHERE email = 'admin@tutorconnect.com';

INSERT INTO admin_permissions (user_id, admin_role)
SELECT id, 'tutor_reviewer' FROM users WHERE email = 'sarah.review@tutorconnect.com';

-- Tutors (approved)
INSERT INTO users (id, full_name, email, role, account_status, timezone) VALUES
  (gen_random_uuid(), 'Dr. Sarah Chen', 'sarah.chen@tutorconnect.com', 'tutor', 'active', 'America/New_York'),
  (gen_random_uuid(), 'Prof. James Wilson', 'james.wilson@tutorconnect.com', 'tutor', 'active', 'America/Los_Angeles'),
  (gen_random_uuid(), 'Ms. Elena Rodriguez', 'elena.r@tutorconnect.com', 'tutor', 'active', 'America/Chicago'),
  (gen_random_uuid(), 'Dr. Michael Hart', 'michael.hart@tutorconnect.com', 'tutor', 'active', 'America/New_York'),
  (gen_random_uuid(), 'Prof. Alex Rivera', 'alex.rivera@tutorconnect.com', 'tutor', 'active', 'America/Denver');

-- Tutor profiles
INSERT INTO tutors (id, user_id, bio, experience_years, qualification, hourly_rate, is_approved, languages)
SELECT gen_random_uuid(), id, 'PhD in Mathematics from MIT. 15+ years teaching experience.', 15, 'PhD Mathematics, MIT', 65, TRUE, 'English, Mandarin'
FROM users WHERE email = 'sarah.chen@tutorconnect.com';

INSERT INTO tutors (id, user_id, bio, experience_years, qualification, hourly_rate, is_approved, languages)
SELECT gen_random_uuid(), id, 'Full-stack developer. Expert in React, Node.js, Python.', 10, 'MSc Computer Science, Stanford', 55, TRUE, 'English'
FROM users WHERE email = 'james.wilson@tutorconnect.com';

INSERT INTO tutors (id, user_id, bio, experience_years, qualification, hourly_rate, is_approved, languages)
SELECT gen_random_uuid(), id, 'Native Spanish speaker. Teaching languages for 8 years.', 8, 'MA Linguistics, Barcelona', 45, TRUE, 'Spanish, English, French'
FROM users WHERE email = 'elena.r@tutorconnect.com';

INSERT INTO tutors (id, user_id, bio, experience_years, qualification, hourly_rate, is_approved, languages)
SELECT gen_random_uuid(), id, 'PhD in Physics, published researcher. Making science accessible.', 12, 'PhD Physics, Caltech', 60, TRUE, 'English'
FROM users WHERE email = 'michael.hart@tutorconnect.com';

INSERT INTO tutors (id, user_id, bio, experience_years, qualification, hourly_rate, is_approved, languages)
SELECT gen_random_uuid(), id, 'Software engineer teaching coding to beginners and advanced students.', 7, 'BSc Computer Science, MIT', 50, TRUE, 'English, Hindi'
FROM users WHERE email = 'alex.rivera@tutorconnect.com';

-- Tutor subjects
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

-- Tutor availability (Mon-Sat 9-5 for Sarah Chen)
INSERT INTO availability_rules (tutor_id, day_of_week, start_time, end_time)
SELECT t.id, d, '09:00'::time, '17:00'::time
FROM tutors t JOIN users u ON u.id = t.user_id
CROSS JOIN (VALUES (0),(1),(2),(3),(4),(5)) AS days(d)
WHERE u.email = 'sarah.chen@tutorconnect.com';

-- Lesson products
INSERT INTO lesson_products (name, description, duration_minutes, session_count, is_trial, sort_order) VALUES
  ('Trial Session', '30-minute introductory session', 30, 1, TRUE, 0),
  ('Standard Session', '60-minute one-on-one tutoring', 60, 1, FALSE, 1),
  ('5-Session Pack', '5 sessions at a discounted rate', 60, 5, FALSE, 2),
  ('10-Session Pack', '10 sessions with maximum savings', 60, 10, FALSE, 3);

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
  (gen_random_uuid(), 'Alex Johnson', 'alex.j@example.com', 'student', 'active'),
  (gen_random_uuid(), 'Maya Rivers', 'maya.r@example.com', 'student', 'active'),
  (gen_random_uuid(), 'Leo Rivers', 'leo.r@example.com', 'student', 'active');

-- Parents
INSERT INTO users (id, full_name, email, role, account_status) VALUES
  (gen_random_uuid(), 'David Rivers', 'david.r@example.com', 'parent', 'active');

-- Household
INSERT INTO households (id, name, primary_billing_guardian_id)
SELECT gen_random_uuid(), 'Rivers Family', id FROM users WHERE email = 'david.r@example.com';

-- Household members
INSERT INTO household_members (household_id, user_id, role_in_household)
SELECT h.id, u.id, 'guardian'
FROM households h, users u WHERE u.email = 'david.r@example.com';

INSERT INTO household_members (household_id, user_id, role_in_household)
SELECT h.id, u.id, 'student'
FROM households h, users u WHERE u.email = 'maya.r@example.com';

INSERT INTO household_members (household_id, user_id, role_in_household)
SELECT h.id, u.id, 'student'
FROM households h, users u WHERE u.email = 'leo.r@example.com';

-- Guardian-student links
INSERT INTO guardian_student_links (guardian_id, student_id, relationship, is_billing_responsible)
SELECT p.id, s.id, 'Father', TRUE
FROM users p, users s
WHERE p.email = 'david.r@example.com' AND s.email = 'maya.r@example.com';

INSERT INTO guardian_student_links (guardian_id, student_id, relationship, is_billing_responsible)
SELECT p.id, s.id, 'Father', TRUE
FROM users p, users s
WHERE p.email = 'david.r@example.com' AND s.email = 'leo.r@example.com';

-- Bookings
INSERT INTO bookings (student_id, tutor_id, subject_id, booking_type, scheduled_at, status, student_name, booking_mode)
SELECT s.id, t.id, sub.id, 'trial', NOW() + INTERVAL '2 days', 'confirmed', 'Alex Johnson', 'instant'
FROM users s, tutors t JOIN users tu ON tu.id = t.user_id, subjects sub
WHERE s.email = 'alex.j@example.com' AND tu.email = 'sarah.chen@tutorconnect.com' AND sub.name = 'Mathematics'
LIMIT 1;

INSERT INTO bookings (student_id, tutor_id, subject_id, booking_type, scheduled_at, status, student_name, booking_mode)
SELECT s.id, t.id, sub.id, 'paid', NOW() + INTERVAL '5 days', 'confirmed', 'Maya Rivers', 'instant'
FROM users s, tutors t JOIN users tu ON tu.id = t.user_id, subjects sub
WHERE s.email = 'maya.r@example.com' AND tu.email = 'michael.hart@tutorconnect.com' AND sub.name = 'Physics'
LIMIT 1;

INSERT INTO bookings (student_id, tutor_id, subject_id, booking_type, scheduled_at, status, student_name, booking_mode)
SELECT s.id, t.id, sub.id, 'paid', NOW() + INTERVAL '7 days', 'pending', 'Leo Rivers', 'tutor_approval'
FROM users s, tutors t JOIN users tu ON tu.id = t.user_id, subjects sub
WHERE s.email = 'leo.r@example.com' AND tu.email = 'elena.r@tutorconnect.com' AND sub.name = 'English'
LIMIT 1;

-- Booking participants (for the first booking)
INSERT INTO booking_participants (booking_id, user_id, role)
SELECT b.id, b.student_id, 'student' FROM bookings b LIMIT 1;
INSERT INTO booking_participants (booking_id, user_id, role)
SELECT b.id, tu.id, 'tutor' FROM bookings b
JOIN tutors t ON t.id = b.tutor_id
JOIN users tu ON tu.id = t.user_id
LIMIT 1;

-- Learning goals
INSERT INTO learning_goals (student_id, title, target_date, status, progress_pct)
SELECT id, 'Ace SAT Math', '2026-12-15', 'active', 65 FROM users WHERE email = 'alex.j@example.com';
INSERT INTO learning_goals (student_id, title, target_date, status, progress_pct)
SELECT id, 'Complete AP Calculus', '2027-03-01', 'active', 30 FROM users WHERE email = 'alex.j@example.com';
INSERT INTO learning_goals (student_id, title, target_date, status, progress_pct)
SELECT id, 'Master Quantum Physics', '2026-11-01', 'active', 45 FROM users WHERE email = 'maya.r@example.com';
INSERT INTO learning_goals (student_id, title, target_date, status, progress_pct)
SELECT id, 'Improve Creative Writing', '2026-12-01', 'active', 70 FROM users WHERE email = 'leo.r@example.com';

-- Progress records
INSERT INTO progress_records (student_id, metric_type, metric_value, notes)
SELECT id, 'hours_studied', 24.5, 'Total study hours this month' FROM users WHERE email = 'alex.j@example.com';
INSERT INTO progress_records (student_id, metric_type, metric_value, notes)
SELECT id, 'avg_score', 87, 'Average assessment score' FROM users WHERE email = 'alex.j@example.com';
INSERT INTO progress_records (student_id, metric_type, metric_value, notes)
SELECT id, 'hours_studied', 18.5, 'Total study hours this month' FROM users WHERE email = 'maya.r@example.com';
INSERT INTO progress_records (student_id, metric_type, metric_value, notes)
SELECT id, 'avg_score', 92, 'Average assessment score' FROM users WHERE email = 'maya.r@example.com';

-- Assignments
INSERT INTO assignments (tutor_id, student_id, title, description, due_at, status, max_score)
SELECT t.id, s.id, 'Calculus Problem Set #4', 'Derivatives and applications', NOW() + INTERVAL '7 days', 'assigned', 100
FROM tutors t JOIN users tu ON tu.id = t.user_id, users s
WHERE tu.email = 'sarah.chen@tutorconnect.com' AND s.email = 'alex.j@example.com';

INSERT INTO assignments (tutor_id, student_id, title, description, due_at, status, max_score)
SELECT t.id, s.id, 'Physics Lab Report', 'Quantum mechanics experiment analysis', NOW() + INTERVAL '14 days', 'assigned', 100
FROM tutors t JOIN users tu ON tu.id = t.user_id, users s
WHERE tu.email = 'michael.hart@tutorconnect.com' AND s.email = 'maya.r@example.com';

-- Reviews
INSERT INTO reviews (student_id, tutor_id, rating, comment, is_approved)
SELECT s.id, t.id, 5, 'Dr. Chen is an amazing tutor! She explains complex concepts clearly.', TRUE
FROM users s, tutors t JOIN users tu ON tu.id = t.user_id
WHERE s.email = 'alex.j@example.com' AND tu.email = 'sarah.chen@tutorconnect.com'
LIMIT 1;

INSERT INTO reviews (student_id, tutor_id, rating, comment, is_approved)
SELECT s.id, t.id, 4, 'Great tutor! Helped me understand physics concepts.', TRUE
FROM users s, tutors t JOIN users tu ON tu.id = t.user_id
WHERE s.email = 'maya.r@example.com' AND tu.email = 'michael.hart@tutorconnect.com'
LIMIT 1;

-- Audit logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
SELECT id, 'admin_session_started', 'session', 'sess_001', '{"ip": "192.168.1.1"}'
FROM users WHERE email = 'admin@tutorconnect.com';

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
SELECT id, 'application_approved', 'application', 'app_001', '{"tutor": "Dr. Sarah Chen"}'
FROM users WHERE email = 'sarah.review@tutorconnect.com';

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
SELECT id, 'tutor_approved', 'tutor', 't_001', '{"tutor_email": "sarah.chen@tutorconnect.com"}'
FROM users WHERE email = 'sarah.review@tutorconnect.com';

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
SELECT id, 'payment_received', 'payment', 'pay_001', '{"amount": 65.00}'
FROM users WHERE email = 'admin@tutorconnect.com';

-- Feature flags (set mode to booking_payment)
INSERT INTO feature_flags (key, value, description) VALUES
  ('operating_mode', 'booking_payment', 'Current platform mode: inquiry, booking, or booking_payment')
ON CONFLICT (key) DO UPDATE SET value = 'booking_payment';

-- Notifications
INSERT INTO notifications (user_id, type, title, body, data)
SELECT id, 'booking_confirmed', 'Lesson Confirmed!', 'Your trial session is confirmed.', '{}'::jsonb
FROM users WHERE email = 'alex.j@example.com';

INSERT INTO notifications (user_id, type, title, body, data)
SELECT id, 'new_booking', 'New Booking Request', 'A student has booked a session with you.', '{}'::jsonb
FROM users WHERE email = 'sarah.chen@tutorconnect.com';

INSERT INTO notifications (user_id, type, title, body, data)
SELECT id, 'booking_confirmed', 'Lesson Booked for Maya', 'Maya has a Physics lesson confirmed.', '{}'::jsonb
FROM users WHERE email = 'david.r@example.com';

INSERT INTO notifications (user_id, type, title, body, data)
SELECT id, 'assignment_due', 'Assignment Due Soon', 'Your Physics Lab Report is due in 7 days.', '{}'::jsonb
FROM users WHERE email = 'maya.r@example.com';

-- Contact messages
INSERT INTO contact_messages (name, email, message) VALUES
  ('Jane Smith', 'jane.smith@example.com', 'I am interested in learning Python programming. Do you have tutors available for beginners?'),
  ('Tom Brown', 'tom.b@example.com', 'What are your cancellation policies for monthly packages?');
