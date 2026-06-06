# Wildspot

Wildspot is a mobile-first web app for discovering and sharing animal sightings around the UCI campus. It includes UCI map discovery, Supabase-backed account login, post creation, realtime nearby chat, profile editing, reporting, Supabase database persistence, and Supabase Storage image uploads.

## Run the app

```bash
cd hw4
python3 -m http.server 5174
```

Open:

```text
http://127.0.0.1:5174/index.html
```

If port `5174` is busy:

```bash
python3 -m http.server 5175
```

Then open `http://127.0.0.1:5175/index.html`.

## Demo flow

1. Create an account with an email ending in `@uci.edu`.
2. View the UCI campus map, existing animal sighting pins, and the live service status panel.
3. Create a post:
   - choose a photo
   - fill Animal, Caption, and Hashtags
   - click Share
4. Verify Supabase:
   - `Authentication > Users`
   - `Table Editor > profiles`
   - `Table Editor > posts`
   - `Table Editor > follows`
   - `Storage > sightings-media`
5. Send a nearby chat message and verify `nearby_messages`.
6. Open a second browser window and confirm chat appears without refreshing.
7. Report a post and verify `reports`.

## Supabase setup

1. Create a Supabase project.
2. Open `SQL Editor`.
3. Run:

```text
database/schema.sql
```

This creates:

- `profiles`
- `posts`
- `follows`
- `nearby_messages`
- `reports`
- `sightings-media` Storage bucket
- RLS policies for browser-side demo writes
- Realtime publication for `nearby_messages`

4. In Supabase Auth settings, use the Email provider. For easiest local demo, disable email confirmation.

5. Copy the Supabase project URL and publishable key into:

```text
src/config.js
```

Example:

```js
window.WILDSPOT_CONFIG = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your publishable key"
};
```

## Tests

Run:

```bash
npm test
```

Current snapshot:

```text
19 passing, 0 failing
```

Coverage:

```bash
npm run coverage
```

## Project structure

```text
index.html
styles.css
app.js
src/
  config.js
  core.js
database/
  schema.sql
tests/
  unit/
  integration/
docs/
  TEST_PLAN.md
coverage/
  index.html
```

## Known limits

- Auth uses Supabase Auth when configured, with local fallback only when Supabase config is missing.
- Storage upload is connected to Supabase, but media validation is minimal.
- Realtime chat uses Supabase Realtime for new `nearby_messages` rows.
- Tests cover core logic and integration contracts; browser click tests are future work.
