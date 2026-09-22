# Music Hub (Spotify-like Listener App)

## Scope and Legal Framing
This project is a **Spotify-like** music listener application for learning and product prototyping.
It does **not** use Spotify branding, copyrighted assets, or proprietary APIs/content by default.

## Phase Plan with Acceptance Criteria

### Phase 1 — Core Playback + Library (MVP)
Features:
- Guest onboarding and auth gate
- Home / Search / Library navigation
- Track catalog models and in-app playback controls
- Queue, seek, shuffle, repeat, now playing screen
- Like/save tracks
- Playlist create and add/remove track actions

Acceptance criteria:
- App launches to onboarding for new session
- User can enter app and navigate between Home, Search, Library
- User can start playback from Home/Search and open Player screen
- User can like/unlike tracks and see liked tracks in Library
- User can create playlist and add current track
- TypeScript compilation succeeds

### Phase 2 — Search + Playlists + Recommendations
Features:
- Better search ranking and filters
- Recommendation rails and mixes
- Playlist management UX improvements

Acceptance criteria:
- Search supports multiple filter dimensions
- Recommendation sections render deterministically from profile/history
- Playlist flows are test-covered

### Phase 3 — Offline + Social + Polish
Features:
- Offline downloads and sync states
- Recently played enhancements
- Sharing, follow, collaborative playlists
- Lyrics and social listening indicators

Acceptance criteria:
- Offline tracks play with network disabled
- Social actions persist and reflect in UI
- Accessibility and localization baseline pass

### Phase 4 — Scale Hardening + Growth
Features:
- Service-level scalability improvements
- Full observability and release gating
- Advanced growth loops

Acceptance criteria:
- SLO dashboards and alerts in place
- Controlled rollouts via feature flags
- Crash-free and performance KPIs meet targets

## Platform Services (Target Architecture)
- Auth and user profiles
- Catalog/search services
- Recommendation service
- Playlist/library services
- Playback session and rights service
- Notifications and analytics pipeline
- Admin and moderation tooling

## Non-Functional Foundations
- Security and privacy controls
- Performance budgets, caching, CDN strategy
- Logging, metrics, tracing
- Feature flags and staged rollout strategy
- Accessibility and localization

## Current Repository Status
This repository currently implements a Phase 1 foundation using local/demo data and Expo.
