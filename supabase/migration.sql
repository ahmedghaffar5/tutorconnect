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

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admin can view contact messages" ON contact_messages
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
