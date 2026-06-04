alter table restaurants alter column user_id set default auth.uid();
alter table picks alter column user_id set default auth.uid();