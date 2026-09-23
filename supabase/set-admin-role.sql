-- Run this in Supabase SQL Editor after creating the user.
-- Replace the email with the account that should access /admin.
update auth.users
set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', 'admin')
where email = 'admin@example.com';

select id, email, raw_user_meta_data ->> 'role' as role
from auth.users
where email = 'admin@example.com';
