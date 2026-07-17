-- Add plan column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS plan TEXT;
UPDATE bookings SET plan = 'trial' WHERE booking_type = 'trial' AND plan IS NULL;
UPDATE bookings SET plan = 'single' WHERE booking_type = 'paid' AND plan IS NULL;

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant table permissions to anon and authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Drop existing policies first to avoid duplicate errors
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin can view contact messages" ON contact_messages;

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admin can view contact messages" ON contact_messages
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Create RPC function for contact messages (bypasses table permissions)
CREATE OR REPLACE FUNCTION public.insert_contact_message(
  p_name TEXT,
  p_email TEXT,
  p_message TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.contact_messages (name, email, message)
  VALUES (p_name, p_email, p_message);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
