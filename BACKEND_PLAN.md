# NOVA TRACK — Stage 3 Backend Preparation

This document records the backend decision before implementation.

## Current state

The repository currently contains a browser-based V1 prototype. Its data is stored in browser localStorage, so it is not yet a multi-user cloud application.

## Target architecture

Browser Web App
→ Authentication
→ API / application layer
→ Database
→ User-owned NOVA TRACK records

Future:
Android Companion ─┐
Windows Companion ─┴→ same authenticated cloud data

## Backend requirements

The backend must support:
- User authentication
- Secure per-user data ownership
- Goals
- Habits
- Focus sessions
- Timeline events
- Achievements
- Analytics queries
- Future device-sync records

## Non-negotiable rules

1. A user must only be able to access their own records.
2. Device data must never be collected without the required OS permissions.
3. Productivity scores remain derived from source activity.
4. Local V1 data must be migratable.
5. Backend secrets must never be placed in browser JavaScript.
6. The web client should communicate with the backend through authenticated requests.

## Implementation order

1. Backend project/configuration
2. Authentication
3. Database schema
4. Secure API/data access
5. Web-client integration
6. Local-data migration
7. Cross-device synchronization foundation

## Why the current website may appear unchanged

The project is being built incrementally. Many recent commits have been architecture and data-layer work, which changes how the application works internally rather than creating a completely new visible screen.

The next backend implementation will produce user-visible changes such as account state and cloud-backed data once the backend is actually connected.