-- Fix contact_messages RLS policy (role is in user_metadata, not top-level JWT)
DROP POLICY IF EXISTS "Admin can view contact messages" ON contact_messages;

CREATE POLICY "Admin can view contact messages" ON contact_messages
  FOR SELECT USING (auth.jwt()->'user_metadata'->>'role' = 'admin');
