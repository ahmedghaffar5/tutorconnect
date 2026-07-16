-- Add plan column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS plan TEXT;

-- Update existing bookings
UPDATE bookings SET plan = 'trial' WHERE booking_type = 'trial' AND plan IS NULL;
UPDATE bookings SET plan = 'single' WHERE booking_type = 'paid' AND plan IS NULL;
