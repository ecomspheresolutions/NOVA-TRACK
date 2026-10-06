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

### Stage 3 — Account and cloud architecture
Next.

The current V1 intentionally stores data in the browser. This keeps the prototype simple and avoids pretending that cloud synchronization already exists.

## Stage 3 plan

1. Define the application data model.
2. Choose the authentication/database architecture.
3. Add user identity and secure data ownership.
4. Add cloud synchronization.
5. Add migration from existing local V1 data.
6. Add privacy controls.
7. Test cross-device behavior.

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

## Repository structure

- `index.html` — application shell
- `styles.css` — interface styling
- `app.js` — V1 application logic and local data layer

## Status

**Local V1 prototype: functional foundation complete.**

**Cloud/account layer: not yet implemented.**
