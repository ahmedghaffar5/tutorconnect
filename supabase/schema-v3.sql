-- ============================================================
-- TUTORCONNECT v3 PRODUCTION SCHEMA
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS & ROLES
-- ============================================================

-- Canonical user roles (enum-like via CHECK constraint on users.role)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL UNIQUE CHECK (role IN (
    'student', 'parent', 'tutor_applicant', 'tutor', 'admin'
  )),
  description TEXT,
  is_assignable BOOLEAN DEFAULT TRUE -- can users self-register as this role?
);

-- Seed roles
INSERT INTO user_roles (role, description, is_assignable) VALUES
  ('student', 'Learner who attends lessons', TRUE),
  ('parent', 'Guardian responsible for one or more students', TRUE),
  ('tutor_applicant', 'User who has applied to become a tutor', FALSE),
  ('tutor', 'Approved educator with published profile', FALSE),
  ('admin', 'Marketplace administrator', FALSE);

-- Admin sub-roles (granular permissions)
CREATE TABLE admin_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  admin_role TEXT NOT NULL CHECK (admin_role IN (
    'super_admin', 'tutor_reviewer', 'operations', 'support',
    'finance', 'content_manager', 'safeguarding_lead', 'analyst', 'auditor'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, admin_role)
);

-- Households (family units)
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  primary_billing_guardian_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Household members
CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role_in_household TEXT CHECK (role_in_household IN ('guardian', 'student', 'other')),
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guardian-student relationships
CREATE TABLE guardian_student_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guardian_id UUID NOT NULL,
  student_id UUID NOT NULL,
  relationship TEXT,
  is_billing_responsible BOOLEAN DEFAULT FALSE,
  permissions JSONB DEFAULT '{}',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guardian_id, student_id)
);

-- Consent records
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT FALSE,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions (for security auditing)
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  signed_in_at TIMESTAMPTZ DEFAULT NOW(),
  signed_out_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- TUTOR OPERATIONS
-- ============================================================

-- Tutor levels (which academic levels they teach)
CREATE TABLE tutor_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL,
  level TEXT NOT NULL,
  UNIQUE(tutor_id, level)
);

-- Tutor curricula
CREATE TABLE tutor_curricula (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL,
  curriculum TEXT NOT NULL,
  UNIQUE(tutor_id, curriculum)
);

-- Availability rules (recurring weekly)
CREATE TABLE availability_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(tutor_id, day_of_week, start_time, end_time)
);

-- Availability exceptions (time off, one-off slots)
CREATE TABLE availability_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL,
  exception_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT FALSE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutor status history
CREATE TABLE tutor_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification checks
CREATE TABLE verification_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL,
  check_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'expired')),
  checked_by UUID,
  notes TEXT,
  checked_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MARKETPLACE & BOOKING
-- ============================================================

-- Lesson products (e.g. "60-min trial", "60-min standard", "5-lesson pack")
CREATE TABLE lesson_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  session_count INTEGER DEFAULT 1,
  is_trial BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutor-specific pricing for products
CREATE TABLE tutor_product_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL,
  product_id UUID REFERENCES lesson_products(id) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(tutor_id, product_id)
);

-- Slot holds (prevent double-booking during checkout)
CREATE TABLE slot_holds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  held_by UUID,
  hold_expires_at TIMESTAMPTZ NOT NULL,
  booking_id UUID,
  is_expired BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking status history
CREATE TABLE booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking participants
CREATE TABLE booking_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'guardian', 'tutor')),
  UNIQUE(booking_id, user_id)
);

-- Reschedule requests
CREATE TABLE reschedule_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL,
  requested_by UUID NOT NULL,
  proposed_start TIMESTAMPTZ NOT NULL,
  proposed_end TIMESTAMPTZ NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cancellation requests
CREATE TABLE cancellation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL,
  requested_by UUID NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance records
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'present', 'late', 'absent', 'excused')),
  UNIQUE(session_id, user_id)
);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_methods_reference (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) NOT NULL,
  stripe_payment_method_id TEXT,
  type TEXT,
  last_four TEXT,
  expiry_month SMALLINT,
  expiry_year SMALLINT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_intents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID,
  customer_id UUID REFERENCES customers(id),
  stripe_payment_intent_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'created' CHECK (status IN (
    'created', 'requires_payment_method', 'requires_action',
    'processing', 'authorised', 'paid', 'failed',
    'partially_refunded', 'refunded', 'disputed', 'cancelled'
  )),
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_intent_id UUID REFERENCES payment_intents(id),
  type TEXT NOT NULL CHECK (type IN (
    'lesson_payment', 'package_purchase', 'wallet_top_up',
    'promotional_credit', 'refund', 'partial_refund',
    'chargeback', 'tutor_earning', 'platform_commission',
    'tutor_payout', 'adjustment'
  )),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID,
  customer_id UUID REFERENCES customers(id),
  invoice_number TEXT UNIQUE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_intent_id UUID REFERENCES payment_intents(id) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processed', 'failed')),
  requested_by UUID,
  processed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL,
  raised_by UUID NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
  resolution TEXT,
  resolved_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE tutor_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL UNIQUE,
  pending_balance NUMERIC(10,2) DEFAULT 0,
  available_balance NUMERIC(10,2) DEFAULT 0,
  total_earned NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  stripe_transfer_id TEXT,
  period_start DATE,
  period_end DATE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE promotion_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'free_trial')),
  value NUMERIC(10,2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LEARNING
-- ============================================================

CREATE TABLE learning_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  progress_pct SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE progress_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL,
  subject_id UUID,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC(10,2),
  recorded_by UUID,
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID,
  tutor_id UUID NOT NULL,
  student_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_at TIMESTAMPTZ,
  status TEXT DEFAULT 'assigned' CHECK (status IN (
    'draft', 'assigned', 'in_progress', 'submitted', 'late',
    'under_review', 'graded', 'revision_requested', 'resubmitted', 'closed'
  )),
  max_score NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignment_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
  score NUMERIC(10,2),
  max_score NUMERIC(10,2),
  feedback TEXT,
  graded_by UUID,
  graded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'shared_student', 'shared_guardian', 'shared_both')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMMUNICATION
-- ============================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT,
  context_type TEXT,
  context_id UUID,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  last_read_at TIMESTAMPTZ,
  is_muted BOOLEAN DEFAULT FALSE,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  reply_to_id UUID REFERENCES messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE message_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) NOT NULL,
  reported_by UUID NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  resolved_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COURSES & RESOURCES (future modules, minimal schema)
-- ============================================================

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  tutor_id UUID,
  subject_id UUID,
  level TEXT,
  price NUMERIC(10,2),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT,
  content_url TEXT,
  duration_minutes INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_enrolments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) NOT NULL,
  user_id UUID NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(course_id, user_id)
);

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID,
  level TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  owner_id UUID,
  is_published BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PLATFORM OPERATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  channel TEXT DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'push', 'sms')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  channel TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, event_type, channel)
);

CREATE TABLE support_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  subject TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_on_user', 'resolved', 'closed')),
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE safeguarding_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_by UUID NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id UUID,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'processing', 'completed', 'failed')),
  idempotency_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADD COLUMNS TO EXISTING TABLES
-- ============================================================

-- Add account status to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active' CHECK (account_status IN (
  'invited', 'pending_email_verification', 'active', 'restricted', 'suspended', 'deactivated', 'deleted'
));
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Add booking_mode to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_mode TEXT DEFAULT 'instant' CHECK (booking_mode IN ('instant', 'tutor_approval', 'enquiry'));

-- Add invoice_number, subtotal, fee, discount, tax to payments
ALTER TABLE payments ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10,2);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS fee NUMERIC(10,2);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS discount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS tax NUMERIC(10,2) DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS invoice_number TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- ============================================================
-- RLS POLICIES (CORE)
-- ============================================================

-- Users: self-read, admin-read-all
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "self_read" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "admin_read_all" ON users FOR SELECT USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "self_update" ON users FOR UPDATE USING (auth.uid() = id);

-- Guardian-student: guardian reads linked, student reads own
ALTER TABLE guardian_student_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "guardian_access" ON guardian_student_links;
DROP POLICY IF EXISTS "student_access" ON guardian_student_links;
CREATE POLICY "guardian_access" ON guardian_student_links FOR ALL USING (auth.uid() = guardian_id);
CREATE POLICY "student_view" ON guardian_student_links FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "admin_access" ON guardian_student_links FOR ALL USING (auth.jwt()->>'role' = 'admin');

-- Bookings: student sees own, tutor sees assigned, admin sees all
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Tutors can view assigned bookings" ON bookings;
CREATE POLICY "student_booking_access" ON bookings FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "tutor_booking_access" ON bookings FOR SELECT USING (EXISTS (SELECT 1 FROM tutors WHERE id = tutor_id AND user_id = auth.uid()));
CREATE POLICY "admin_booking_access" ON bookings FOR SELECT USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "student_booking_insert" ON bookings FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Messages: participant access only
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "participant_access" ON messages;
CREATE POLICY "participant_access" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- Notifications: own only
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "self_notifications" ON notifications;
CREATE POLICY "self_notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Audit logs: insert by any, select by admin only
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_audit" ON audit_logs;
DROP POLICY IF EXISTS "select_audit" ON audit_logs;
CREATE POLICY "insert_audit" ON audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "select_audit" ON audit_logs FOR SELECT USING (auth.jwt()->>'role' = 'admin');

-- Session notes: participants see shared, author sees own private
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "session_note_access" ON session_notes;
CREATE POLICY "session_note_access" ON session_notes FOR SELECT USING (
  auth.uid() = author_id OR visibility IN ('shared_student', 'shared_guardian', 'shared_both')
);

-- Feature flags: public read, admin write
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_flags" ON feature_flags;
DROP POLICY IF EXISTS "admin_write_flags" ON feature_flags;
CREATE POLICY "public_read_flags" ON feature_flags FOR SELECT USING (true);
CREATE POLICY "admin_write_flags" ON feature_flags FOR ALL USING (auth.jwt()->>'role' = 'admin');

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tutor ON bookings(tutor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_tutor_availability ON availability_rules(tutor_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_slot_holds_tutor ON slot_holds(tutor_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_payment_intents_booking ON payment_intents(booking_id);
CREATE INDEX IF NOT EXISTS idx_guardian_links_guardian ON guardian_student_links(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_links_student ON guardian_student_links(student_id);
