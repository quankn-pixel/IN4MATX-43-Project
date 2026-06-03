# Wildspot Test Plan and Implementation Report

The readme file in the Hw4 is the instructions of launching the app.


## Part 1 - Test Plan (Strategic)

### 1.1 Scope: what's in, what's out

| Scope | Why this matters |
| --- | --- |
| In scope: map filter by animal category (All, Birds, Mammals, Other) | Filter buttons and search bar are in index.html; filtering queries Supabase posts by category |
| In scope: upload error states — oversized file (>25MB), missing media, failed publish | index.html enforces 25MB max; upload-status element shows feedback; silent failures would break user trust |
| In scope: post detail screen loading | detail-screen and detail-card exist in index.html; broken post detail is immediately visible to users |
| In scope: UCI-only email enforcement at signup | isUciEmail() in core.js enforces @uci.edu; a bug here lets non-UCI users in |
| In scope: HTML escaping of user content | escapeHtml() in core.js; XSS risk if broken |
| In scope: animal categorization logic | categorizeAnimal() in core.js drives map filter categories |
| In scope: Supabase Auth signup, login, logout, profile editing | High user impact; blocks posting, chat, profile, and reports |
| In scope: UCI campus map rendering and sighting pins | Core discovery workflow |
| In scope: post creation, tags, privacy settings, local persistence | Main product workflow and privacy promise |
| In scope: nearby chat and message persistence | Required social/nearby communication workflow |
| In scope: report creation | Safety requirement |
| Out of scope: real email delivery / verification | Supabase Auth is wired, but email confirmation is disabled/reduced for local demo speed |
| Out of scope: saved posts / My Collections | Architected in HW2 but not implemented in prototype; no code to test |
| Out of scope: iOS/Android device compatibility | Time constraint; tested on local browser only |
| Out of scope: performance/load testing (e.g. 100 concurrent uploads) | Requires special tooling; documented |
| Out of scope: Google/Apple OAuth login | Third-party auth; we test only the Supabase email boundary |
| In scope: Supabase database, Storage, and Realtime wiring | Demonstrates actual backend persistence for posts, chat, reports, profiles, sighting media, and live nearby messages |
| Out of scope: full cross-browser matrix | Time constraint; Chrome/local browser is the target for this snapshot |

### 1.2 Quality goals

- No critical bug blocks signup, login, logout, posting, viewing map pins, chat, or profile editing.
- At least 5 unit tests and at least 3 integration tests pass locally.
- Tests can be run from a fresh clone with one command: `npm test`.
- Local coverage can be measured with `npm run coverage`.
- Privacy-sensitive posts use approximate UCI campus positions rather than exact real-time tracking.
- PWA assets referenced by the app are included in the service worker cache list.
- Supabase Auth, database writes, Storage uploads, and Realtime chat have at least one manual verification path for demo.
- - Backend returns correct status codes: 200/201 on success, 
  400 on missing required fields, 404 on missing resource; 
  no silent failure.
- When approximate location is ON, stored coordinates are 
  blurred to a UCI campus zone rather than exact GPS.
- Applying an animal-type filter returns only matching posts; 
  an empty result returns a 200 with posts:[] not an error.
- Unauthenticated requests to protected endpoints return 401.
- Upload rejects files over 25MB and shows a clear error message.

### 1.3 Risks and priorities

| Area | Why it's risky / costly | Priority |
| --- | --- | --- |
| Supabase Auth/session flow | If broken, users cannot post or chat; security implications later | H |
| Location privacy | App promise depends on fuzzy campus pins | H |
| Map integration | Leaflet/CDN or marker rendering failure breaks discovery | H |
| Local persistence | Data loss hurts demos and user trust | M |
| Media uploads | Browser file APIs and Storage policies can fail independently from post writes | M |
| Realtime chat | Needs Supabase publication setup and browser subscription stability | M |
| Service worker cache | Stale cache can hide new code during demos | M |
| Map filter correctness | Wrong filter silently shows incorrect sightings; misleads users about wildlife locations | H |
| Upload error handling | Silent failures (oversized file, failed Supabase write) leave app in broken state with no user feedback | M |
| HTML injection via user content | escapeHtml() in core.js must run on all user-generated text; failure is an XSS vulnerability | M |
| Network/backend failures | Users need clear error messages when map data or uploads fail; without this the app feels broken | M |
| Data migration (migrateState) | Old demo posts with Mason Park locations must be remapped to UCI campus; failure breaks map rendering | M |
| Profile/privacy settings | Incorrect privacy toggle behavior could confuse users; lower priority than map/upload | L |

### 1.4 Strategy: test types and approach

- Unit test: tests one isolated function or service rule without rendering the app.
- Integration test: tests that multiple project files or app contracts work together, such as HTML loading scripts and the service worker caching the referenced assets.

| Component | Test types you'll apply | Framework | Why this fit |
| --- | --- | --- | --- |
| Frontend service utilities | Unit | Node test runner | No dependency install needed; fast and deterministic |
| Auth/location/tag/report rules | Unit | Node test runner | Business rules can be tested outside the browser |
| PWA/app wiring | Integration | Node test runner + filesystem assertions | Confirms HTML, manifest, service worker, and scripts align |
| Supabase contracts | Integration | Node test runner + schema/source assertions | Confirms Auth, database tables, Storage bucket, and Realtime subscription are wired |
| Browser flows | Future integration/e2e | Playwright | Would verify real clicks, Leaflet rendering, and form flows |

### 1.5 Environment and assumptions

- Tests assume Node 23.7.0 in the current local environment.
- The app is static HTML/CSS/JS with no npm dependencies.
- Supabase Auth is used when configured; `localStorage` is retained only as local profile/session cache and fallback.
- Leaflet/OpenStreetMap and Supabase are live browser dependencies; automated tests verify wiring, while actual writes are manually verified in Supabase Table Editor/Storage.
- Test data comes from deterministic fixtures in `src/core.js` and test files.

### 1.6 Team roles

| Member | Owns which test categories / components |
| --- | --- |
| Niki Chen Chen | TEST_PLAN.md, risks, quality goals, scope |
| Matthew Contreras | Coverage reports and test documentation |
| Dominic Diaz | UI prototype and Figma design verification |
| Jianhao Zhang | Frontend app behavior, auth/profile flows, UCI map integration, unit and integration tests |
| Quan Nguyen | Frontend tests, architecture documentation |

## Part 2 - Tests Implemented + Report

Last updated: 2026-06-02 (commit: uncommitted local snapshot)

### 2.1 Required minimums

| Category | Required? | Minimum |
| --- | --- | --- |
| Unit tests | Required | >= 5 tests |
| Integration tests | Required | >= 3 tests |

Status: implemented 7 unit tests and 10 integration tests.

### 2.3 Tests by category

Last updated: 2026-06-02 (commit: uncommitted local snapshot)

| Category | Count | 2+ examples |
| --- | ---: | --- |
| Unit | 7 | `normalizeTags adds missing hash prefixes`; `isUciEmail accepts only UCI email addresses`; `createReport returns a moderator-ready report record` |
| Integration | 10 | `app shell wires Leaflet, shared core, and application scripts`; `application script is valid JavaScript`; `database schema and app include persistent follows`; `application subscribes to realtime nearby chat inserts` |

Latest result: 17 passing, 0 failing, duration ~82 ms.
Latest backend snapshot: Supabase Auth, tables, `sightings-media` bucket, Storage upload, `nearby_messages.room`, Realtime chat, and `follows` schema/write path documented on 2026-06-02.

### 2.4 Where the tests live + how to run them

```text
src/core.js
tests/unit/core.test.js
tests/integration/app-contract.test.js
coverage/index.html
```

Run commands:

```bash
npm test
npm run coverage
```

Approximate runtimes:

| Category | Time | Where it runs |
| --- | --- | --- |
| Unit | < 1s | local + CI |
| Integration | < 1s | local + CI |

### 2.5 Coverage achieved

Last updated: 2026-06-02 (commit: uncommitted local snapshot)

| Test type | Tool | Coverage % |
| --- | --- | --- |
| Unit | `node --test --experimental-test-coverage` | Core service lines: 100.00% |
| Integration | `node --test --experimental-test-coverage` | Contract files exercised through Node test assertions |
| Combined overall | Node coverage report | `src/core.js`: 100.00% line, 78.26% branch, 100.00% function |

What is not covered yet: real browser clicks, Leaflet tile rendering, geolocation permission prompts, actual email delivery/confirmation, and automated live Supabase write tests.

Committed HTML snapshot: `coverage/index.html`.

### 2.6 Plan-vs-implementation gap

| What the plan called for | What you actually shipped | What blocked you / what you'd add next |
| --- | --- | --- |
| Full account tests including real email verification | Supabase Auth is wired and manually verified, but automated email confirmation tests are not implemented | Email delivery is slow/flaky for local demos; disabled/reduced confirmation is used |
| Browser interaction tests | Static integration contracts and unit service tests | Add Playwright once dependency installation is allowed |
| Backend/API tests | Supabase schema contract tests plus manual Table Editor/Storage verification | Automated live Supabase tests would need managed test credentials and cleanup scripts |
| Chat rooms persisted by room | Added `nearby_messages.room` schema support and app-side room routing for Near me, Aldrich Park, and Post thread | Existing old messages default to `near-me`; future work could add per-room retention cleanup |
| Backend API tests (Post Service, Map Service, User Service) | Only frontend logic and Supabase schema contract tests shipped | Not enough resources for a separate backend layer this sprint; planned for next phase |

## Part 3 - Reflection

The tests caught a design problem that was easy to miss while building the UI: too much important behavior originally lived directly inside `app.js`. That made the app work visually, but it made meaningful unit testing harder because rules like tag normalization, UCI email validation, report creation, location fallback, and data migration were mixed together with DOM rendering. Moving those rules into `src/core.js` made the behavior easier to test and also made the app safer to change. For example, the tests now protect against accidentally accepting non-UCI emails, rendering unsafe HTML, or placing old demo posts outside the UCI campus map area.

The hardest parts to test were the browser and backend behaviors. Leaflet map rendering depends on browser layout and external map tiles. Supabase Auth, Storage uploads, database writes, and Realtime chat depend on a live project, policies, test accounts, and network state. Because of that, our automated tests focus on deterministic logic and integration contracts: HTML script order, service worker cached files, manifest setup, Supabase schema requirements, follows, Storage bucket wiring, and Realtime subscription code. Actual Supabase writes are still manually verified through the Table Editor and Storage dashboard.

If we had more time, the next tests would be Playwright end-to-end tests. The highest-value flow would create or sign in to a demo account, upload a sighting with an image, confirm that the post appears on the UCI map and in the sightings list, open the post detail view, send a room-specific chat message, follow a tracker, and submit a report. That would test the experience the user actually sees, not just the static contracts.

The AI assistant helped most with separating testable logic from UI code, drafting the test plan, and creating coverage/report artifacts quickly. It was less reliable for judging full product quality from code alone; visual layout, stale browser cache, Supabase rate limits, and real login behavior still required manual testing and human judgment.
