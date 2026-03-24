-- Fix: infinite recursion in staff_profiles RLS policies
-- The admin policies on staff_profiles query staff_profiles itself,
-- causing infinite recursion. Use a SECURITY DEFINER function instead.

-- 1. Create a helper that bypasses RLS to check admin status
CREATE OR REPLACE FUNCTION public.is_sop_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_profiles
    WHERE id = auth.uid() AND role = 'Admin'
  );
$$;

-- 2. Fix staff_profiles policies
DROP POLICY IF EXISTS "Admins read all staff profiles" ON public.staff_profiles;
CREATE POLICY "Admins read all staff profiles"
  ON public.staff_profiles FOR SELECT
  USING (public.is_sop_admin());

DROP POLICY IF EXISTS "Admins insert staff profiles" ON public.staff_profiles;
CREATE POLICY "Admins insert staff profiles"
  ON public.staff_profiles FOR INSERT
  WITH CHECK (public.is_sop_admin());

-- 3. Fix sop_training_progress admin policy
DROP POLICY IF EXISTS "Admins read all sop training progress" ON public.sop_training_progress;
CREATE POLICY "Admins read all sop training progress"
  ON public.sop_training_progress FOR SELECT
  USING (public.is_sop_admin());

-- 4. Fix sop_quiz_attempts admin policy
DROP POLICY IF EXISTS "Admins read all sop quiz attempts" ON public.sop_quiz_attempts;
CREATE POLICY "Admins read all sop quiz attempts"
  ON public.sop_quiz_attempts FOR SELECT
  USING (public.is_sop_admin());
