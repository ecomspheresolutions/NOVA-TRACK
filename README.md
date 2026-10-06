# NOVA TRACK

NOVA TRACK is a personal Digital Wellbeing & Productivity Platform designed to help track activity, goals, habits, focus sessions, achievements, and productivity insights.

## V1 scope

- Dashboard
- Activity tracking
- Goals
- Habits and streaks
- Focus timer
- Analytics
- Achievements
- Settings

## Current build status

**Stage 1 — V1 interface foundation is now implemented.**

The repository contains a lightweight browser-based V1 shell with:
- Responsive NOVA TRACK dashboard
- Navigation for all planned V1 areas
- Initial dashboard metrics
- Daily timeline placeholder
- 25-minute focus timer
- Placeholder states for goals, habits, analytics, achievements and settings

This first stage deliberately uses plain HTML, CSS and JavaScript so the interface can be tested immediately without a build system.

## Next stages

1. Add persistent data storage.
2. Implement goals and habits CRUD.
3. Persist focus sessions and build daily timeline records.
4. Add analytics and achievement calculations.
5. Add authentication/privacy controls.
6. Move toward permitted Android/Windows companion tracking.

## Development principles

1. Build a working V1 before advanced device integrations.
2. Never claim automatic device tracking unless it has been technically implemented and tested.
3. Keep user data and privacy central.
4. Build in small, testable stages.
5. Document important architecture and product decisions.

## Planned architecture

Web dashboard → application/data layer → persistent database

Later:
- Android companion for permitted device-usage data
- Windows companion for desktop activity
- Cross-device synchronization
