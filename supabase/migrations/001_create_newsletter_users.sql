-- Create newsletter_users table
-- This table stores users who sign up for the BMX Denver newsletter

CREATE TABLE IF NOT EXISTS newsletter_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_users_email ON newsletter_users(email);

-- Create index on subscribed_at for analytics
CREATE INDEX IF NOT EXISTS idx_newsletter_users_subscribed_at ON newsletter_users(subscribed_at);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_newsletter_users_updated_at
  BEFORE UPDATE ON newsletter_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for newsletter signups)
CREATE POLICY "Allow public newsletter signups"
  ON newsletter_users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow service role to read all records (for admin purposes)
CREATE POLICY "Allow service role to read all newsletter users"
  ON newsletter_users
  FOR SELECT
  TO service_role
  USING (true);

