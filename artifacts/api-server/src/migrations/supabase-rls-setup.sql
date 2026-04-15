-- =============================================================================
-- Supabase RLS + Trigger Setup for QB Portal
-- =============================================================================
-- These statements must be run in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- for both the dev and production Supabase projects.
-- They cannot be run via Drizzle — they reference Supabase-specific schemas (auth.users, storage.objects).
-- =============================================================================

-- 0. Foreign Key: Link qb_users.id to auth.users(id)
-- This enforces that every qb_users row corresponds to a Supabase Auth user.
ALTER TABLE public.qb_users
  ADD CONSTRAINT qb_users_id_auth_users_fk
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 1. Profile Creation Trigger
-- Automatically creates a qb_users profile row for every new Supabase Auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.qb_users (id, email, name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Enable RLS on all qb tables
ALTER TABLE public.qb_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qb_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qb_order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qb_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qb_waitlist_signups ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for qb_users
CREATE POLICY "users_own_profile" ON public.qb_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON public.qb_users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "operator_read_all_users" ON public.qb_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );

-- 4. RLS Policies for qb_orders
CREATE POLICY "customer_own_orders" ON public.qb_orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "customer_insert_order" ON public.qb_orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "operator_all_orders" ON public.qb_orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );

-- 5. RLS Policies for qb_order_files
CREATE POLICY "customer_own_order_files" ON public.qb_order_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qb_orders o
      WHERE o.id = qb_order_files.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "operator_all_order_files" ON public.qb_order_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );

-- 6. RLS Policies for qb_support_tickets
CREATE POLICY "customer_own_tickets" ON public.qb_support_tickets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "customer_insert_ticket" ON public.qb_support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "operator_all_tickets" ON public.qb_support_tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );

-- 7. RLS Policies for qb_waitlist_signups
CREATE POLICY "authenticated_insert_waitlist" ON public.qb_waitlist_signups
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "operator_read_waitlist" ON public.qb_waitlist_signups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );
