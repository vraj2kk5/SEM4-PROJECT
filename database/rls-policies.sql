-- Row Level Security Policies for Smart IoT Dashboard

-- ============================================
-- USER PROFILES TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- DUSTBIN LOGS TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own logs" ON dustbin_logs;
DROP POLICY IF EXISTS "Users can insert their own logs" ON dustbin_logs;
DROP POLICY IF EXISTS "Admins can view all logs" ON dustbin_logs;

-- Enable RLS
ALTER TABLE dustbin_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own logs
CREATE POLICY "Users can view their own logs"
  ON dustbin_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own logs
CREATE POLICY "Users can insert their own logs"
  ON dustbin_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all logs
CREATE POLICY "Admins can view all logs"
  ON dustbin_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Service role can insert logs (for IoT devices)
CREATE POLICY "Service role can insert logs"
  ON dustbin_logs FOR INSERT
  WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's total logs count
CREATE OR REPLACE FUNCTION get_user_logs_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM dustbin_logs
    WHERE dustbin_logs.user_id = get_user_logs_count.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's full events count
CREATE OR REPLACE FUNCTION get_user_full_events(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM dustbin_logs
    WHERE dustbin_logs.user_id = get_user_full_events.user_id
    AND status = 'full'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's empty events count
CREATE OR REPLACE FUNCTION get_user_empty_events(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM dustbin_logs
    WHERE dustbin_logs.user_id = get_user_empty_events.user_id
    AND status = 'empty'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get average fill level
CREATE OR REPLACE FUNCTION get_user_avg_level(user_id UUID)
RETURNS NUMERIC AS $$
BEGIN
  RETURN (
    SELECT AVG(level) FROM dustbin_logs
    WHERE dustbin_logs.user_id = get_user_avg_level.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
