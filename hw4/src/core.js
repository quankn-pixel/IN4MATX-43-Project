(function attachCore(root) {
  const UCI_CENTER = [33.6405, -117.8443];
  const UCI_BOUNDS = [
    [33.6315, -117.8585],
    [33.6525, -117.8255]
  ];
  const campusPlaces = [
    { name: "Aldrich Park", latlng: [33.6461, -117.8427] },
    { name: "Ring Road", latlng: [33.6441, -117.8446] },
    { name: "Science Library", latlng: [33.6447, -117.8467] },
    { name: "Student Center", latlng: [33.6493, -117.8429] },
    { name: "ARC fields", latlng: [33.6432, -117.8291] }
  ];

  function normalizeTags(value) {
    return String(value)
      .split(/\s+/)
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function fallbackPosition(post) {
    const [lat, lng] = post.latlng || UCI_CENTER;
    return {
      x: Math.min(82, Math.max(18, 50 + (lng - UCI_CENTER[1]) * 2400)),
      y: Math.min(74, Math.max(26, 50 - (lat - UCI_CENTER[0]) * 3200))
    };
  }

  function categorizeAnimal(title) {
    if (/duck|bird|owl|heron|hawk|eagle/i.test(title)) return "Bird";
    if (/dog|deer|fox|cat|coyote|rabbit|squirrel/i.test(title)) return "Mammal";
    return "Other";
  }

  function isUciEmail(email) {
    return /^[^\s@]+@uci\.edu$/i.test(String(email).trim());
  }

  function createReport(postId, reason = "Unsafe or inaccurate content", now = Date.now()) {
    return { id: `report-${now}`, postId, reason, createdAt: now, status: "open" };
  }

  function migrateState(nextState) {
    nextState.reports ||= [];
    nextState.posts = (nextState.posts || []).map((post, index) => ({
      ...post,
      latlng: post.latlng || campusPlaces[index % campusPlaces.length].latlng,
      location: post.location?.replace("Mason Park", "Aldrich Park") || campusPlaces[index % campusPlaces.length].name
    }));
    return nextState.posts.length ? nextState : null;
  }

  const api = {
    UCI_CENTER,
    UCI_BOUNDS,
    campusPlaces,
    normalizeTags,
    escapeHtml,
    fallbackPosition,
    categorizeAnimal,
    isUciEmail,
    createReport,
    migrateState
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.WildspotCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
