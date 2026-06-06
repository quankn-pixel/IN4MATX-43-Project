const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "../..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("app shell wires Leaflet, shared core, and application scripts in order", () => {
  const html = read("index.html");
  assert.ok(html.includes("leaflet.css"));
  assert.ok(html.indexOf("./src/core.js") < html.indexOf("./app.js"));
  assert.ok(html.includes('id="uci-map"'));
});

test("application script is valid JavaScript", () => {
  const result = spawnSync(process.execPath, ["--check", path.join(root, "app.js")], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});

test("auth gate includes sign in, signup, email, and password controls", () => {
  const html = read("index.html");
  assert.ok(html.includes('id="auth-gate"'));
  assert.ok(html.includes('data-auth-mode="signin"'));
  assert.ok(html.includes('data-auth-mode="signup"'));
  assert.ok(html.includes('id="auth-email"'));
  assert.ok(html.includes('id="auth-password"'));
});

test("service worker precaches every local runtime asset referenced by the app", () => {
  const html = read("index.html");
  const sw = read("sw.js");
  ["./index.html", "./styles.css", "./src/config.js", "./src/core.js", "./app.js", "./manifest.json", "./icon.svg"].forEach((asset) => {
    assert.ok(sw.includes(asset), `${asset} missing from service worker cache`);
  });
  assert.ok(html.includes("./manifest.json"));
});

test("manifest is installable and points at the Wildspot icon", () => {
  const manifest = JSON.parse(read("manifest.json"));
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./index.html");
  assert.ok(manifest.icons.some((icon) => icon.src === "./icon.svg"));
});

test("database integration includes Supabase config and required tables", () => {
  const html = read("index.html");
  const schema = read("database/schema.sql");
  assert.ok(html.includes("@supabase/supabase-js"));
  assert.ok(html.includes("./src/config.js"));
  ["profiles", "posts", "follows", "nearby_messages", "reports"].forEach((table) => {
    assert.ok(schema.includes(`public.${table}`), `${table} table missing`);
  });
  assert.ok(schema.includes("sightings-media"));
  assert.ok(schema.includes("storage.buckets"));
});

test("database schema and app include persistent follows", () => {
  const app = read("app.js");
  const schema = read("database/schema.sql");
  assert.ok(schema.includes("public.follows"));
  assert.ok(schema.includes("follower_id"));
  assert.ok(schema.includes("target_key"));
  assert.ok(app.includes('.from("follows")'));
  assert.ok(app.includes("saveFollow"));
  assert.ok(app.includes("deleteFollow"));
});

test("application auth service uses Supabase Auth when configured", () => {
  const app = read("app.js");
  assert.ok(app.includes(".auth.signUp"));
  assert.ok(app.includes(".auth.signInWithPassword"));
  assert.ok(app.includes(".auth.getSession"));
  assert.ok(app.includes(".auth.signOut"));
});

test("application subscribes to realtime nearby chat inserts", () => {
  const app = read("app.js");
  const schema = read("database/schema.sql");
  assert.ok(app.includes('.channel("wildspot-nearby-chat")'));
  assert.ok(app.includes('"postgres_changes"'));
  assert.ok(app.includes('table: "nearby_messages"'));
  assert.ok(schema.includes("room text not null default 'near-me'"));
  assert.ok(app.includes("message.room"));
  assert.ok(schema.includes("alter publication supabase_realtime add table public.nearby_messages"));
  assert.ok(schema.includes("when duplicate_object then null"));
});

test("app shell exposes service status panel for demo visibility", () => {
  const html = read("index.html");
  const app = read("app.js");
  ["database", "auth", "storage", "realtime"].forEach((service) => {
    assert.ok(html.includes(`data-service="${service}"`), `${service} status missing`);
  });
  assert.ok(app.includes("renderServiceStatuses"));
});

test("profile tabs and saved sightings have real app wiring", () => {
  const html = read("index.html");
  const app = read("app.js");
  assert.ok(html.includes('data-profile-tab="grid"'));
  assert.ok(html.includes('data-profile-tab="map"'));
  assert.ok(html.includes('data-profile-tab="saved"'));
  assert.ok(app.includes("activeProfileTab"));
  assert.ok(app.includes("toggleSavedPost"));
  assert.ok(app.includes("isPostSaved"));
});

test("upload and post management avoid the known demo regressions", () => {
  const html = read("index.html");
  const app = read("app.js");
  const schema = read("database/schema.sql");
  assert.ok(!html.includes("menu-mark"));
  assert.ok(html.includes("Upload →"));
  assert.ok(html.includes('name="sighting-icon"'));
  ["Dangerous", "Cute", "Funny", "Interaction"].forEach((label) => {
    assert.ok(html.includes(label), `${label} icon option missing`);
  });
  assert.ok(app.includes('const STORAGE_KEY = "wildspot-state-v3"'));
  assert.ok(app.includes("animalEmoji(title, category)"));
  assert.ok(app.includes("selectedSightingIcon()"));
  assert.ok(app.includes("PrivacyService.uploadLatLng"));
  assert.ok(app.includes("deletePost(postId)"));
  assert.ok(schema.includes('"posts can be deleted by client"'));
});

test("map and profile icons are derived from species instead of stale stored emoji", () => {
  const app = read("app.js");
  assert.ok(app.includes("function displayEmoji(post)"));
  assert.ok(app.includes("isChosenSightingIcon(row.emoji)"));
  assert.ok(app.includes("sightingIconOptions"));
  assert.ok(app.includes("${displayEmoji(post)}</div>"));
  assert.ok(!app.includes("post.emoji ||"));
  assert.ok(!app.includes("row.emoji ||"));
});
