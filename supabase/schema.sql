-- TutorConnect Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'tutor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Tutors table
CREATE TABLE tutors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  qualification TEXT,
  hourly_rate NUMERIC(10,2),
  monthly_rate NUMERIC(10,2),
  profile_image_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  languages TEXT DEFAULT 'English',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;

-- Subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Tutor-Subjects junction
CREATE TABLE tutor_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES tutors(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(tutor_id, subject_id)
);

ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;

-- Availability table
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES tutors(id) ON DELETE CASCADE NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tutor_id UUID REFERENCES tutors(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('trial', 'paid')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  student_name TEXT,
  student_age INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL UNIQUE,
  meeting_link TEXT,
  class_notes TEXT,
  homework TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tutor_id UUID REFERENCES tutors(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: users can read own data, admin can read all
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can view all users" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Tutors: public can view approved, tutors can edit own
CREATE POLICY "Public can view approved tutors" ON tutors FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Tutors can view own profile" ON tutors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all tutors" ON tutors FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Tutors can update own profile" ON tutors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Tutors can insert own profile" ON tutors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update any tutor" ON tutors FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Subjects: public read, admin write
CREATE POLICY "Public can view subjects" ON subjects FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage subjects" ON subjects FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Tutor subjects: public read, tutors manage own
CREATE POLICY "Public can view tutor subjects" ON tutor_subjects FOR SELECT USING (TRUE);
CREATE POLICY "Tutors can manage own subjects" ON tutor_subjects FOR ALL USING (EXISTS (SELECT 1 FROM tutors WHERE id = tutor_id AND user_id = auth.uid()));

-- Availability: public read, tutors manage own
CREATE POLICY "Public can view availability" ON availability FOR SELECT USING (TRUE);
CREATE POLICY "Tutors can manage own availability" ON availability FOR ALL USING (EXISTS (SELECT 1 FROM tutors WHERE id = tutor_id AND user_id = auth.uid()));

-- Bookings: students view own, tutors view assigned, admin view all
CREATE POLICY "Students can view own bookings" ON bookings FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Tutors can view assigned bookings" ON bookings FOR SELECT USING (EXISTS (SELECT 1 FROM tutors WHERE id = tutor_id AND user_id = auth.uid()));
CREATE POLICY "Admin can view all bookings" ON bookings FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Students can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admin can update bookings" ON bookings FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Tutors can update assigned bookings" ON bookings FOR UPDATE USING (EXISTS (SELECT 1 FROM tutors WHERE id = tutor_id AND user_id = auth.uid()));

-- Classes: participants view, admin all
CREATE POLICY "Students can view own classes" ON classes FOR SELECT USING (EXISTS (SELECT 1 FROM bookings WHERE id = booking_id AND student_id = auth.uid()));
CREATE POLICY "Tutors can view own classes" ON classes FOR SELECT USING (EXISTS (SELECT 1 FROM bookings JOIN tutors ON bookings.tutor_id = tutors.id WHERE classes.booking_id = bookings.id AND tutors.user_id = auth.uid()));
CREATE POLICY "Admin can view all classes" ON classes FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Tutors can update own classes" ON classes FOR UPDATE USING (EXISTS (SELECT 1 FROM bookings JOIN tutors ON bookings.tutor_id = tutors.id WHERE classes.booking_id = bookings.id AND tutors.user_id = auth.uid()));
CREATE POLICY "Admin can update all classes" ON classes FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Payments: users view own, admin all
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all payments" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Reviews: public read approved, students create, admin approve
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Students can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admin can manage reviews" ON reviews FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Seed subjects
INSERT INTO subjects (name, description, icon) VALUES
('Mathematics', 'Algebra, calculus, geometry, and more', 'calculator'),
('English', 'Grammar, literature, writing, and speaking', 'book-open'),
('Science', 'General science and scientific methods', 'flask'),
('Computer Science', 'Programming, algorithms, and computing', 'monitor'),
('Coding', 'Web development, Python, JavaScript, and more', 'code'),
('Quran', 'Quran reading, memorization, and Tajweed', 'book-heart'),
('Urdu', 'Urdu language and literature', 'globe'),
('Physics', 'Mechanics, thermodynamics, and electromagnetism', 'zap'),
('Chemistry', 'Organic, inorganic, and physical chemistry', 'atom'),
('Biology', 'Human biology, genetics, and ecology', 'leaf');
