# NOVA TRACK Data Model

## Core entities

### User
- id
- createdAt
- displayName
- timezone
- settings

### Goal
- id
- userId
- title
- done
- createdAt
- completedAt

### Habit
- id
- userId
- title
- streak
- lastCompletedDate
- createdAt

### FocusSession
- id
- userId
- date
- startedAt
- completedAt
- minutes
- status

### TimelineEvent
- id
- userId
- date
- time
- type
- text
- metadata

### Achievement
- id
- userId
- key
- unlockedAt

## Relationships

User
→ Goals
→ Habits
→ Focus Sessions
→ Timeline Events
→ Achievements

## Design rules

1. Every cloud-owned record must have a userId.
2. Client-generated IDs should be replaced or validated by the backend when cloud storage is introduced.
3. Dates/times should preserve timezone context.
4. Timeline events are append-oriented activity records.
5. Derived values such as productivity score should be recalculable from source records.
6. Sensitive data should not be stored unless required for a feature.
7. Local V1 data must remain migratable into this model.

## Migration mapping

Current localStorage:
- goals[] → Goal
- habits[] → Habit
- sessions[] → FocusSession
- timeline[] → TimelineEvent

The current browser prototype does not yet create User IDs or cloud records.