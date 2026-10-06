# NOVA TRACK

NOVA TRACK is a personal Digital Wellbeing & Productivity Platform designed to help answer four questions:

1. Where did my time go?
2. What did I accomplish?
3. What caused distraction?
4. What should I change?

## V1 core features

- Dashboard
- Goals and completion tracking
- Habits and streaks
- 25-minute focus sessions
- Activity timeline
- Productivity score
- Activity history
- Achievements
- Local browser persistence
- Responsive interface

## Current build status

### Stage 1 — Interface foundation
Complete.

### Stage 2 — Local V1 tracking
Complete:
- Persistent goals
- Persistent habits and streaks
- Focus sessions
- Timeline events
- Productivity scoring
- Analytics/history
- Achievement rules

### Stage 3 — Cloud foundation
**Database architecture prepared.**

The repository now includes:
- Supabase/PostgreSQL schema
- User ownership through `auth.users`
- User profile foundation with timezone/settings support
- Row Level Security policies
- Database indexes
- Supabase setup documentation

The actual Supabase project is **not connected yet**. No credentials or secrets are stored in the repository.

## Stage 3 plan

1. Define the application data model. **Complete**
2. Choose the authentication/database architecture. **Complete — Supabase**
3. Add user identity and secure data ownership. **Schema prepared; app connection next**
4. Add cloud synchronization. **Application layer prepared; live connection pending**
5. Add migration from existing local V1 data. **Implemented in application layer**
6. Add privacy controls. **Implemented**
7. Test cross-device behavior. **Pending real Supabase project**

## Future device architecture

After the cloud foundation is stable:

**Android companion → permitted device usage data → NOVA TRACK cloud → web dashboard**

**Windows companion → permitted desktop activity → NOVA TRACK cloud → web dashboard**

Device integrations will only report data that the operating system and user permissions technically allow.

## Development principles

1. Build a working V1 before advanced device integrations.
2. Never claim automatic device tracking unless it has been technically implemented and tested.
3. Keep user data and privacy central.
4. Build in small, testable stages.
5. Document important architecture and product decisions.
6. Separate local prototype data from future authenticated cloud data.
7. Never commit private backend secrets.

## Repository structure

- `index.html` — application shell
- `styles.css` — interface styling
- `app.js` — V1 application logic and local data layer
- `supabase/migrations/001_initial_schema.sql` — initial cloud database schema
- `SUPABASE_SETUP.md` — cloud setup and security notes

## Status

**Local V1 prototype: functional foundation complete.**

**Cloud database architecture: prepared.**

**Cloud application layer: prepared.**

**Supabase project connection and live cloud testing: next implementation step.**
