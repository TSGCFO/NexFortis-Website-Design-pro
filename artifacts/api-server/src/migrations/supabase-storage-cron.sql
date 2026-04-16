-- =============================================================================
-- Supabase Storage Auto-Deletion Cron Job
-- =============================================================================
-- This SQL must be run manually in the Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → paste this file → Run
-- It CANNOT be run via Drizzle migrations or the Express API.
-- =============================================================================
-- Job name: "order-files-7day-cleanup"
-- Schedule: Daily at 3:00 AM UTC
-- Purpose: Delete uploaded order files older than 7 days from Supabase Storage
--          and mark corresponding qb_order_files records as expired.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.unschedule('order-files-7day-cleanup')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'order-files-7day-cleanup'
);

SELECT cron.schedule(
  'order-files-7day-cleanup',
  '0 3 * * *',
  $$
  -- Step 1: Delete storage objects older than 7 days from the order-files bucket
  DELETE FROM storage.objects
  WHERE bucket_id = 'order-files'
    AND created_at < NOW() - INTERVAL '7 days';

  -- Step 2: Mark qb_order_files records as expired (only those not already expired)
  UPDATE public.qb_order_files
  SET expired = true,
      deleted_at = NOW()
  WHERE uploaded_at < NOW() - INTERVAL '7 days'
    AND storage_path IS NOT NULL
    AND expired = false;
  $$
);
