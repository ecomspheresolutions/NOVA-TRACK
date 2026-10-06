# NOVA TRACK — Supabase setup

This repository is prepared for the Stage 3 cloud layer using Supabase.

## What is implemented here

- PostgreSQL tables for goals, habits, focus sessions, timeline events, and achievements.
- Every application record is linked to Supabase Auth with `user_id`.
- Row Level Security (RLS) is enabled.
- Policies restrict each signed-in user to their own records.
- Indexes are included for common user/date queries.

## What is not implemented yet

The actual Supabase project has not been connected to NOVA TRACK from this repository. No project URL, API key, or secret is stored in GitHub.

## Next connection step

1. Create a Supabase project.
2. Open the SQL Editor.
3. Run `supabase/migrations/001_initial_schema.sql`.
4. Configure authentication providers as desired.
5. Add the public Supabase project URL and publishable/anon key through deployment configuration — never commit service-role keys.
6. Then connect `app.js` to Auth + the database and migrate existing localStorage data.

## Security rule

Never place a Supabase service-role key in browser code, GitHub, or public repository files.
