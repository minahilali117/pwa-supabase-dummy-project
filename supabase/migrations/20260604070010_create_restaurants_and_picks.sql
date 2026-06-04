-- Restaurants table
create table restaurants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- Picks table
create table picks (
  id uuid default gen_random_uuid() primary key,
  restaurant_name text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table restaurants enable row level security;
alter table picks enable row level security;

create policy "Users manage own restaurants" on restaurants
  for all using (auth.uid() = user_id);

create policy "Users manage own picks" on picks
  for all using (auth.uid() = user_id);