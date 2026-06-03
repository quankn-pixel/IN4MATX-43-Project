const test = require("node:test");
const assert = require("node:assert/strict");
const {
  UCI_CENTER,
  campusPlaces,
  normalizeTags,
  escapeHtml,
  fallbackPosition,
  categorizeAnimal,
  isUciEmail,
  createReport,
  migrateState
} = require("../../src/core");

test("normalizeTags adds missing hash prefixes and removes blanks", () => {
  assert.deepEqual(normalizeTags(" duck   #uci aldrich "), ["#duck", "#uci", "#aldrich"]);
});

test("escapeHtml prevents injected markup from being rendered", () => {
  assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
});

test("fallbackPosition keeps campus markers within visible map bounds", () => {
  const position = fallbackPosition({ latlng: UCI_CENTER });
  assert.equal(position.x, 50);
  assert.equal(position.y, 50);
  assert.ok(position.x >= 18 && position.x <= 82);
  assert.ok(position.y >= 26 && position.y <= 74);
});

test("categorizeAnimal maps common campus sightings to product categories", () => {
  assert.equal(categorizeAnimal("Red-tailed hawk"), "Bird");
  assert.equal(categorizeAnimal("Campus squirrel"), "Mammal");
  assert.equal(categorizeAnimal("Lizard"), "Other");
});

test("isUciEmail accepts only UCI email addresses", () => {
  assert.equal(isUciEmail("student@uci.edu"), true);
  assert.equal(isUciEmail("student@example.com"), false);
});

test("createReport returns a moderator-ready report record", () => {
  assert.deepEqual(createReport("post-1", "spam", 123), {
    id: "report-123",
    postId: "post-1",
    reason: "spam",
    createdAt: 123,
    status: "open"
  });
});

test("migrateState backfills lat/lng and moves old Mason Park data to UCI language", () => {
  const migrated = migrateState({ posts: [{ id: "old", location: "Mason Park trail" }] });
  assert.equal(migrated.reports.length, 0);
  assert.equal(migrated.posts[0].location, "Aldrich Park trail");
  assert.deepEqual(migrated.posts[0].latlng, campusPlaces[0].latlng);
});
