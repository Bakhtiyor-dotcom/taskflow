-- TaskFlow admin metrics. Run once in Supabase SQL Editor.
-- Only authenticated users whose ID is present in public.app_admins
-- are allowed to call this function.

create or replace function public.admin_dashboard_data()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null
     or not exists (
       select 1 from public.app_admins as a
       where a.user_id = current_user_id
     )
  then
    raise exception 'Admin access required'
      using errcode = '42501';
  end if;

  return jsonb_build_object(
    'total_users', (select count(*) from auth.users),
    'total_tasks', (select count(*) from public.tasks),
    'completed_tasks', (
      select count(*) from public.tasks where status = 'Completed'
    ),
    'in_progress_tasks', (
      select count(*) from public.tasks where status = 'In Progress'
    ),
    'overdue_tasks', (
      select count(*) from public.tasks
      where due_date < current_date and status <> 'Completed'
    ),
    'recent_users', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object('email', u.email, 'created_at', u.created_at)
          order by u.created_at desc
        ),
        '[]'::jsonb
      )
      from (
        select email, created_at
        from auth.users
        order by created_at desc
        limit 8
      ) as u
    )
  );
end;
$$;

-- PostgreSQL functions may be executable by PUBLIC by default.
-- Restrict this function explicitly; the function also verifies admin role.
revoke all privileges on function public.admin_dashboard_data() from public;
revoke all privileges on function public.admin_dashboard_data() from anon;
grant execute on function public.admin_dashboard_data() to authenticated;
