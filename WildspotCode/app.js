const STORAGE_KEY = "wildspot-state-v2";
const AUTH_KEY = "wildspot-auth-v1";
const {
  UCI_CENTER,
  UCI_BOUNDS,
  campusPlaces,
  normalizeTags,
  escapeHtml,
  fallbackPosition,
  categorizeAnimal,
  isUciEmail,
  createReport,
  migrateState: migrateCoreState
} = window.WildspotCore;

const seedState = {
  locationPrivacy: true,
  reports: [],
  posts: [
    {
      id: "duck-1",
      title: "Mallard",
      category: "Bird",
      caption: "Observed near Aldrich Park during a quiet morning route. Location remains blurred to protect the animal and nearby visitors.",
      location: "Aldrich Park",
      distance: "0.2 mi",
      createdAt: Date.now() - 1000 * 60 * 7,
      tags: ["#duck", "#aldrichpark", "#uci"],
      emoji: "🦆",
      media: "https://images.unsplash.com/photo-1521460249485-4e4f92c9de5d?auto=format&fit=crop&w=900&q=80",
      visibility: "Public",
      delayed: true,
      approximate: true,
      latlng: [33.6459, -117.8429]
    },
    {
      id: "squirrel-1",
      title: "Red Fox",
      category: "Mammal",
      caption: "Spotted this healthy adult Red Fox patrolling the edge of the property just after dusk. Exact location is protected.",
      location: "Backyard Woods",
      distance: "0.3 mi",
      createdAt: Date.now() - 1000 * 60 * 16,
      tags: ["#wildlife", "#redfox", "#virginianature"],
      emoji: "🦊",
      media: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=80",
      visibility: "Public",
      delayed: true,
      approximate: true,
      latlng: [33.6443, -117.8447]
    },
    {
      id: "rabbit-1",
      title: "Blue Jay",
      category: "Bird",
      caption: "This Blue Jay appeared comfortable around nearby visitors. The location is approximate for safety.",
      location: "St. James Park",
      distance: "0.4 mi",
      createdAt: Date.now() - 1000 * 60 * 48,
      tags: ["#wildlife", "#birds", "#protected"],
      emoji: "🐦",
      media: "https://images.unsplash.com/photo-1501706362039-c6e809b6b4ac?auto=format&fit=crop&w=900&q=80",
      visibility: "Public",
      delayed: true,
      approximate: true,
      latlng: [33.6447, -117.8465]
    },
    {
      id: "hawk-1",
      title: "Red-tailed hawk",
      category: "Bird",
      caption: "Brief flyover above Aldrich Park. Please observe from a distance.",
      location: "Aldrich Park canopy",
      distance: "0.5 mi",
      createdAt: Date.now() - 1000 * 60 * 82,
      tags: ["#hawk", "#aldrichpark", "#bird"],
      emoji: "🦅",
      media: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?auto=format&fit=crop&w=900&q=80",
      visibility: "Public",
      delayed: true,
      approximate: true,
      latlng: [33.6468, -117.8416]
    }
  ],
  messages: [
    { id: "m1", text: "Anyone else see the rabbit near Science Library?", author: "nearby_user", mine: false, room: "near-me", createdAt: Date.now() - 1000 * 60 * 8 },
    { id: "m2", text: "Yes, I just posted a fuzzy pin for it.", author: "You", mine: true, room: "near-me", createdAt: Date.now() - 1000 * 60 * 5 },
    { id: "m3", text: "Nice. Was it close to Ring Road?", author: "nearby_user", mine: false, room: "near-me", createdAt: Date.now() - 1000 * 60 * 2 },
    { id: "m4", text: "Aldrich Park trail is quiet right now.", author: "ParkWatcher", mine: false, room: "aldrich-park", createdAt: Date.now() - 1000 * 60 * 4 },
    { id: "m5", text: "Please keep distance from the pond edge.", author: "Ranger Alex", mine: false, room: "aldrich-park", createdAt: Date.now() - 1000 * 60 * 3 }
  ]
};

const demoMediaById = {
  "duck-1": "https://images.unsplash.com/photo-1521460249485-4e4f92c9de5d?auto=format&fit=crop&w=900&q=80",
  "squirrel-1": "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=80",
  "rabbit-1": "https://images.unsplash.com/photo-1501706362039-c6e809b6b4ac?auto=format&fit=crop&w=900&q=80",
  "hawk-1": "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?auto=format&fit=crop&w=900&q=80"
};

let state = loadState();
let authState = loadAuthState();
let activeFilter = "all";
let mediaDataUrl = "";
let selectedMediaFile = null;
let selectedPostId = state.posts[0]?.id;
let authMode = "signin";
let activeChatRoom = "near-me";
let toastTimer;

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav-button");
const cameraButton = document.querySelector(".camera-button");
const searchInput = document.querySelector("#search-input");
const filterRow = document.querySelector("#filter-row");
const pinLayer = document.querySelector("#pin-layer");
const postList = document.querySelector("#post-list");
const resultCount = document.querySelector("#result-count");
const mapCountBadge = document.querySelector("#map-count-badge");
const detailCard = document.querySelector("#detail-card");
const detailTitle = document.querySelector("#detail-title");
const detailMeta = document.querySelector("#detail-meta");
const chatList = document.querySelector("#chat-list");
const chatHeading = document.querySelector("#chat-title");
const chatRoomTabs = document.querySelector("#chat-room-tabs");
const chatRoomTitle = document.querySelector("#chat-room-title");
const chatRoomCopy = document.querySelector("#chat-room-copy");
const chatInput = document.querySelector("#chat-input");
const sightingsList = document.querySelector("#sightings-list");
const sightingsTotal = document.querySelector("#sightings-total");
const profileGrid = document.querySelector("#profile-grid");
const profilePostCount = document.querySelector("#profile-post-count");
const profileFollowingCount = document.querySelector("#profile-following-count");
const toast = document.querySelector("#toast");
const mediaInput = document.querySelector("#media-input");
const mediaPicker = document.querySelector("#media-picker");
const mediaPreview = document.querySelector("#media-preview");
const appShell = document.querySelector(".app-shell");
const authGate = document.querySelector("#auth-gate");
const authForm = document.querySelector("#auth-form");
const authStatus = document.querySelector("#auth-status");
const authSubmit = document.querySelector("#auth-submit");
const authDisplayName = document.querySelector("#auth-display-name");
const displayNameField = document.querySelector("#display-name-field");
const authTabs = document.querySelector(".auth-tabs");
const profileAvatar = document.querySelector("#profile-avatar");
const profileTitle = document.querySelector("#profile-title");
const profileBio = document.querySelector("#profile-bio");
const profileForm = document.querySelector("#profile-form");
const profileNameInput = document.querySelector("#profile-name-input");
const profileBioInput = document.querySelector("#profile-bio-input");
const profileVisibilityInput = document.querySelector("#profile-visibility-input");
const accountVisibility = document.querySelector("#account-visibility");
const statusItems = document.querySelectorAll(".status-item");

const chatRooms = {
  "near-me": {
    title: "Transient Chat Active",
    heading: "Nearby Rooms",
    copy: "Messages are ephemeral and cleared when you leave this geographical area.",
    empty: "No nearby messages yet. Start the local conversation.",
    placeholder: "Message nearby..."
  },
  "aldrich-park": {
    title: "Aldrich Park Room",
    heading: "Aldrich Park",
    copy: "Focused chat for sightings and trail updates around Aldrich Park.",
    empty: "No Aldrich Park messages yet. Share a park update.",
    placeholder: "Message Aldrich Park..."
  },
  "post-thread": {
    title: "Post Thread",
    heading: "Post Thread",
    copy: "Discuss the currently selected sighting without revealing exact coordinates.",
    empty: "No post thread messages yet. Ask a respectful question.",
    placeholder: "Message this thread..."
  },
  "neighborhood-watch": {
    title: "Neighborhood Watch",
    heading: "Neighborhood Watch",
    copy: "Coordinate broader wildlife safety reports with nearby observers.",
    empty: "No neighborhood watch messages yet.",
    placeholder: "Message Neighborhood Watch..."
  }
};

function setServiceStatus(service, stateName, label) {
  const item = document.querySelector(`[data-service="${service}"]`);
  if (!item) return;
  item.classList.remove("online", "warning");
  if (stateName) item.classList.add(stateName);
  const text = label || service;
  item.lastChild.textContent = text;
}

function renderServiceStatuses() {
  setServiceStatus("database", DatabaseService.ready ? "online" : "warning", DatabaseService.ready ? "Database" : "Local");
  setServiceStatus("auth", AuthService.currentUser() ? "online" : "warning", AuthService.currentUser() ? "Auth" : "Sign in");
  setServiceStatus("storage", DatabaseService.ready ? "online" : "warning", DatabaseService.ready ? "Storage" : "Local");
  setServiceStatus("realtime", DatabaseService.chatChannel ? "online" : "warning", DatabaseService.chatChannel ? "Realtime" : "Offline");
}

const StorageService = {
  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  reset() {
    localStorage.removeItem(STORAGE_KEY);
    state = structuredClone(seedState);
    selectedPostId = state.posts[0]?.id;
    this.save();
  }
};

const DatabaseService = {
  client: null,
  ready: false,
  chatChannel: null,
  init() {
    const config = window.WILDSPOT_CONFIG || {};
    if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY || !window.supabase) {
      return false;
    }
    this.client = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    this.ready = true;
    renderServiceStatuses();
    return true;
  },
  async load() {
    if (!this.ready) return;
    const [postsResult, messagesResult] = await Promise.all([
      this.client.from("posts").select("*").order("created_at", { ascending: false }),
      this.client.from("nearby_messages").select("*").order("created_at", { ascending: true }).limit(100)
    ]);
    if (!postsResult.error && postsResult.data.length) {
      state.posts = postsResult.data.map(fromDbPost);
    }
    if (!messagesResult.error && messagesResult.data.length) {
      state.messages = messagesResult.data.map(fromDbMessage);
    }
    await this.loadFollows(AuthService.currentUser());
    StorageService.save();
  },
  async loadFollows(user) {
    if (!this.ready || !user) return { ok: false, message: "No signed-in user to load follows." };
    const { data, error } = await this.client.from("follows").select("*").eq("follower_id", user.id);
    if (error) return { ok: false, message: error.message };
    user.following = (data || []).map((follow) => follow.target_key);
    saveAuthState();
    return { ok: true };
  },
  async savePost(post) {
    if (!this.ready) return { ok: false, message: "Database is not configured. Saved locally only." };
    if (post.userId) {
      const user = authState.users.find((item) => item.id === post.userId);
      const profileResult = await this.saveProfile(user);
      if (!profileResult.ok) return profileResult;
    }
    const { error } = await this.client.from("posts").upsert(toDbPost(post));
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  },
  async saveMessage(message) {
    if (!this.ready) return { ok: false, message: "Database is not configured. Saved locally only." };
    const { error } = await this.client.from("nearby_messages").insert(toDbMessage(message));
    if (error?.message?.includes("room")) {
      return { ok: false, message: "Database is missing nearby_messages.room. Run the latest database/schema.sql in Supabase SQL Editor." };
    }
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  },
  subscribeToMessages() {
    if (!this.ready || this.chatChannel) return;
    this.chatChannel = this.client
      .channel("wildspot-nearby-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "nearby_messages" },
        (payload) => {
          const incoming = fromDbMessage(payload.new);
          if (state.messages.some((message) => message.id === incoming.id)) return;
          state.messages.push(incoming);
          StorageService.save();
          renderChat();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          renderServiceStatuses();
          showToast("Realtime chat connected");
        }
      });
  },
  async saveReport(report) {
    if (!this.ready) return { ok: false, message: "Database is not configured. Saved locally only." };
    const { error } = await this.client.from("reports").insert(report);
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  },
  async saveProfile(user) {
    if (!this.ready) return { ok: false, message: "Database is not configured. Saved locally only." };
    if (!user) return { ok: false, message: "No signed-in user profile to save." };
    const { error } = await this.client.from("profiles").upsert({
      id: user.id,
      email: user.email,
      display_name: user.displayName,
      bio: user.bio,
      visibility: user.visibility,
      created_at: new Date(user.createdAt).toISOString()
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  },
  async saveFollow({ user, targetKey, targetLabel }) {
    if (!this.ready) return { ok: false, message: "Database is not configured. Saved locally only." };
    const profileResult = await this.saveProfile(user);
    if (!profileResult.ok) return profileResult;
    const { error } = await this.client.from("follows").upsert({
      id: `${user.id}-${targetKey}`.replace(/[^a-zA-Z0-9_-]/g, "-"),
      follower_id: user.id,
      target_key: targetKey,
      target_label: targetLabel,
      created_at: Date.now()
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  },
  async deleteFollow({ user, targetKey }) {
    if (!this.ready) return { ok: false, message: "Database is not configured. Removed locally only." };
    const { error } = await this.client.from("follows").delete().eq("follower_id", user.id).eq("target_key", targetKey);
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  },
  async uploadMedia(file, userId, postId) {
    if (!file) return { ok: true, url: "" };
    if (!this.ready) return { ok: false, message: "Database storage is not configured. Saved preview locally only." };
    const extension = file.name.split(".").pop() || "jpg";
    const safeExtension = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
    const path = `${userId}/${postId}.${safeExtension}`;
    const { error } = await this.client.storage.from("sightings-media").upload(path, file, {
      cacheControl: "3600",
      upsert: true
    });
    if (error) return { ok: false, message: error.message };
    const { data } = this.client.storage.from("sightings-media").getPublicUrl(path);
    renderServiceStatuses();
    return { ok: true, url: data.publicUrl };
  }
};

const AuthService = {
  currentUser() {
    const user = authState.sessionUserId ? authState.users.find((item) => item.id === authState.sessionUserId) : null;
    if (user && !Array.isArray(user.following)) user.following = [];
    return user;
  },
  cacheUser(user) {
    const existing = authState.users.find((item) => item.id === user.id || item.email === user.email);
    if (existing) {
      user.following = Array.isArray(user.following) ? user.following : existing.following || [];
      Object.assign(existing, user);
    } else {
      user.following ||= [];
      authState.users.push(user);
    }
    authState.sessionUserId = user.id;
    saveAuthState();
    return existing || user;
  },
  fromSupabaseUser(supabaseUser, fallbackDisplayName = "") {
    const email = supabaseUser.email || "";
    const displayName = supabaseUser.user_metadata?.display_name || fallbackDisplayName || email.split("@")[0] || "Wildspotter";
    return {
      id: supabaseUser.id,
      email,
      displayName,
      bio: supabaseUser.user_metadata?.bio || "UCI wildlife spotter · Irvine, CA · Documenting campus wildlife safely",
      visibility: supabaseUser.user_metadata?.visibility || "Public",
      following: supabaseUser.user_metadata?.following || [],
      createdAt: supabaseUser.created_at ? new Date(supabaseUser.created_at).getTime() : Date.now(),
      provider: "supabase"
    };
  },
  async restoreSession() {
    if (!DatabaseService.ready) return this.currentUser();
    const { data } = await DatabaseService.client.auth.getSession();
    if (!data.session?.user) return this.currentUser();
    const user = this.cacheUser(this.fromSupabaseUser(data.session.user));
    await DatabaseService.saveProfile(user);
    return user;
  },
  async hashPassword(password) {
    if (window.crypto?.subtle) {
      const encoded = new TextEncoder().encode(password);
      const digest = await crypto.subtle.digest("SHA-256", encoded);
      return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    return btoa(unescape(encodeURIComponent(password)));
  },
  async signUp({ email, password, displayName }) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isUciEmail(normalizedEmail)) {
      throw new Error("Use your UCI email address for this campus community.");
    }
    if (DatabaseService.ready) {
      const { data, error } = await DatabaseService.client.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            display_name: displayName.trim() || normalizedEmail.split("@")[0],
            bio: "UCI wildlife spotter · Irvine, CA · Documenting campus wildlife safely",
            visibility: "Public",
            following: []
          }
        }
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Supabase did not return a user. Check Auth email settings.");
      const user = this.cacheUser({
        ...this.fromSupabaseUser(data.user, displayName.trim()),
        passwordHash: await this.hashPassword(password)
      });
      const profileResult = await DatabaseService.saveProfile(user);
      if (!profileResult.ok) throw new Error(profileResult.message);
      return user;
    }
    if (authState.users.some((user) => user.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }
    const user = {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      displayName: displayName.trim() || normalizedEmail.split("@")[0],
      bio: "UCI wildlife spotter · Irvine, CA · Documenting campus wildlife safely",
      visibility: "Public",
      createdAt: Date.now(),
      following: [],
      passwordHash: await this.hashPassword(password)
    };
    authState.users.push(user);
    authState.sessionUserId = user.id;
    saveAuthState();
    DatabaseService.saveProfile(user).then((result) => {
      if (!result.ok && DatabaseService.ready) showToast(`Database profile save failed: ${result.message}`);
    });
    return user;
  },
  async signIn({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    if (DatabaseService.ready) {
      const { data, error } = await DatabaseService.client.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });
      if (error) {
        const cachedUser = authState.users.find((item) => item.email === normalizedEmail);
        if (cachedUser?.passwordHash === await this.hashPassword(password)) {
          authState.sessionUserId = cachedUser.id;
          saveAuthState();
          showToast("Signed in with local demo session");
          return cachedUser;
        }
        throw new Error(`${error.message}. If this is a new demo account, use Create account first or disable email confirmation in Supabase Auth settings.`);
      }
      const user = this.cacheUser(this.fromSupabaseUser(data.user));
      await DatabaseService.loadFollows(user);
      await DatabaseService.saveProfile(user);
      return user;
    }
    const user = authState.users.find((item) => item.email === normalizedEmail);
    if (!user || user.passwordHash !== await this.hashPassword(password)) {
      throw new Error("Email or password is incorrect.");
    }
    authState.sessionUserId = user.id;
    saveAuthState();
    return user;
  },
  async signOut() {
    if (DatabaseService.ready) {
      await DatabaseService.client.auth.signOut();
    }
    authState.sessionUserId = null;
    saveAuthState();
  },
  updateProfile({ displayName, bio, visibility }) {
    const user = this.currentUser();
    if (!user) return;
    user.displayName = displayName.trim() || user.displayName;
    user.bio = bio.trim() || user.bio;
    user.visibility = visibility;
    saveAuthState();
    if (DatabaseService.ready && user.provider === "supabase") {
      DatabaseService.client.auth.updateUser({
        data: {
          display_name: user.displayName,
          bio: user.bio,
          visibility: user.visibility
        }
      });
    }
    DatabaseService.saveProfile(user).then((result) => {
      if (!result.ok && DatabaseService.ready) showToast(`Database profile save failed: ${result.message}`);
    });
  },
  isFollowing(authorKey) {
    const user = this.currentUser();
    return Boolean(user && user.following?.includes(authorKey));
  },
  async toggleFollow(authorKey, targetLabel = "Wildspotter") {
    const user = this.currentUser();
    if (!user || !authorKey) return false;
    user.following ||= [];
    const index = user.following.indexOf(authorKey);
    let following;
    if (index >= 0) {
      user.following.splice(index, 1);
      following = false;
    } else {
      user.following.push(authorKey);
      following = true;
    }
    saveAuthState();
    if (DatabaseService.ready) {
      const result = following
        ? await DatabaseService.saveFollow({ user, targetKey: authorKey, targetLabel })
        : await DatabaseService.deleteFollow({ user, targetKey: authorKey });
      if (!result.ok) showToast(`Follow database sync failed: ${result.message}`);
    }
    return following;
  }
};

const PrivacyService = {
  fuzzyLatLng(latlng) {
    if (!state.locationPrivacy) return latlng;
    const jitter = () => (Math.random() - 0.5) * 0.0026;
    return [latlng[0] + jitter(), latlng[1] + jitter()];
  },
  campusRandomLatLng() {
    const place = campusPlaces[Math.floor(Math.random() * campusPlaces.length)];
    return this.fuzzyLatLng(place.latlng);
  }
};

const ReportService = {
  create(postId, reason = "Unsafe or inaccurate content") {
    const report = createReport(postId, reason);
    state.reports.push(report);
    StorageService.save();
    DatabaseService.saveReport(report);
  }
};

function toDbPost(post) {
  return {
    id: post.id,
    user_id: post.userId || null,
    author: post.author || "Wildspotter",
    title: post.title,
    category: post.category,
    caption: post.caption,
    location: post.location,
    distance: post.distance,
    tags: post.tags,
    emoji: post.emoji || "🐾",
    visibility: post.visibility,
    delayed: Boolean(post.delayed),
    approximate: Boolean(post.approximate),
    media: post.media || null,
    lat: post.latlng[0],
    lng: post.latlng[1],
    created_at: post.createdAt
  };
}

function fromDbPost(row) {
  return {
    id: row.id,
    userId: row.user_id,
    author: row.author,
    title: row.title,
    category: row.category,
    caption: row.caption,
    location: row.location,
    distance: row.distance,
    createdAt: row.created_at,
    tags: row.tags || [],
    emoji: row.emoji || "🐾",
    visibility: row.visibility,
    delayed: row.delayed,
    approximate: row.approximate,
    media: row.media,
    latlng: [row.lat, row.lng]
  };
}

function toDbMessage(message) {
  return {
    id: message.id,
    user_id: message.userId || null,
    author: message.author,
    text: message.text,
    room: message.room || "near-me",
    mine: Boolean(message.mine),
    created_at: message.createdAt
  };
}

function fromDbMessage(row) {
  const user = AuthService.currentUser();
  return {
    id: row.id,
    userId: row.user_id,
    author: row.author,
    text: row.text,
    room: row.room || "near-me",
    mine: Boolean(user && row.user_id === user.id),
    createdAt: row.created_at
  };
}

const MapService = {
  map: null,
  markers: new Map(),
  privacyCircle: null,
  init() {
    if (!window.L) {
      pinLayer.style.display = "block";
      showToast("Online map unavailable. Showing fallback campus pins.");
      return;
    }

    this.map = L.map("uci-map", {
      zoomControl: false,
      maxBounds: UCI_BOUNDS,
      maxBoundsViscosity: 0.75
    }).setView(UCI_CENTER, 16);

    L.control.zoom({ position: "bottomleft" }).addTo(this.map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    campusPlaces.forEach((place) => {
      L.circleMarker(place.latlng, {
        radius: 4,
        weight: 1,
        color: "#17452f",
        fillColor: "#ffffff",
        fillOpacity: 0.9
      }).addTo(this.map).bindTooltip(place.name);
    });

    this.privacyCircle = L.circle(UCI_CENTER, {
      radius: 520,
      color: "#28684a",
      weight: 1,
      fillColor: "#28684a",
      fillOpacity: 0.07
    }).addTo(this.map);
  },
  render(posts) {
    if (!this.map) {
      pinLayer.innerHTML = posts.map((post) => `
        <button class="map-pin" style="left:${fallbackPosition(post).x}%; top:${fallbackPosition(post).y}%;" data-post="${post.id}" aria-label="Open ${escapeHtml(post.title)}">
          <span class="pin-dot">${post.emoji || "🐾"}</span>
          <span class="pin-label">${escapeHtml(post.title)}</span>
        </button>
      `).join("");
      return;
    }

    this.markers.forEach((marker, id) => {
      if (!posts.some((post) => post.id === id)) {
        marker.remove();
        this.markers.delete(id);
      }
    });

    posts.forEach((post) => {
      const markerHtml = `<div class="uci-marker ${post.id === selectedPostId ? "selected" : ""}">${post.emoji || "🐾"}</div>`;
      const icon = L.divIcon({ html: markerHtml, className: "", iconSize: [46, 46], iconAnchor: [23, 23] });
      const popup = `
        <div class="uci-popup">
          <strong>${escapeHtml(post.title)}</strong>
          <span>${escapeHtml(post.location)} · ${escapeHtml(post.distance)}</span>
          <button data-post="${post.id}">View sighting</button>
        </div>
      `;

      if (this.markers.has(post.id)) {
        this.markers.get(post.id).setIcon(icon).setLatLng(post.latlng).bindPopup(popup);
      } else {
        const marker = L.marker(post.latlng, { icon }).addTo(this.map).bindPopup(popup);
        marker.on("click", () => {
          selectedPostId = post.id;
          this.render(filteredPosts());
        });
        this.markers.set(post.id, marker);
      }
    });
  },
  focus(post) {
    if (!this.map || !post?.latlng) return;
    this.map.flyTo(post.latlng, 17, { duration: 0.45 });
  },
  locate() {
    if (!navigator.geolocation) {
      showToast("Geolocation is not available");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latlng = [position.coords.latitude, position.coords.longitude];
        if (this.map) {
          this.map.flyTo(latlng, 16);
          L.circle(latlng, { radius: 140, color: "#d8894b", fillOpacity: 0.12 }).addTo(this.map);
        }
        showToast("Location found. Showing a privacy-safe radius.");
      },
      () => showToast("Location permission denied")
    );
  }
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : structuredClone(seedState);
    return migrateState(parsed);
  } catch {
    return structuredClone(seedState);
  }
}

function loadAuthState() {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : { users: [], sessionUserId: null };
  } catch {
    return { users: [], sessionUserId: null };
  }
}

function saveAuthState() {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
}

function requireAuth(actionName = "continue") {
  if (AuthService.currentUser()) return true;
  showAuthGate();
  showToast(`Sign in to ${actionName}`);
  return false;
}

function migrateState(nextState) {
  const migrated = migrateCoreState(nextState) || structuredClone(seedState);
  migrated.posts = migrated.posts.map((post) => ({
    ...post,
    media: post.media || demoMediaById[post.id] || ""
  }));
  return migrated;
}

function showScreen(id) {
  if ((id === "upload-screen" || id === "chat-screen" || id === "profile-screen" || id === "sightings-screen") && !requireAuth(id === "upload-screen" ? "post a sighting" : "continue")) {
    return;
  }
  screens.forEach((screen) => screen.classList.toggle("active", screen.id === id));
  navButtons.forEach((button) => button.classList.remove("active"));
  const activeNav = Array.from(navButtons).find((button) => button.dataset.screen === id);
  if (activeNav) activeNav.classList.add("active");
  if (id === "map-screen" && MapService.map) {
    setTimeout(() => MapService.map.invalidateSize(), 80);
  }
}

function showAuthGate() {
  authGate.classList.add("active");
  appShell.classList.add("locked");
}

function hideAuthGate() {
  authGate.classList.remove("active");
  appShell.classList.remove("locked");
}

function setAuthMode(mode) {
  authMode = mode;
  authTabs.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.authMode === mode));
  displayNameField.hidden = mode !== "signup";
  authSubmit.textContent = mode === "signup" ? "Create account" : "Sign in";
  authStatus.textContent = "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function validateAuthForm({ email, password, displayName }) {
  if (authMode === "signup" && !displayName.trim()) {
    return "Please enter a display name.";
  }
  if (!email.trim()) {
    return "Please enter your email address.";
  }
  if (!email.includes("@") || !email.includes(".")) {
    return "Please enter a valid email address.";
  }
  if (!password) {
    return "Please enter your password.";
  }
  if (password.length < 6) {
    return `Please lengthen this text to 6 characters or more. You are currently using ${password.length} characters.`;
  }
  return "";
}

function timeAgo(timestamp) {
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function postMatches(post) {
  const query = searchInput.value.trim().toLowerCase();
  const text = [post.title, post.category, post.caption, post.location, post.visibility, ...post.tags].join(" ").toLowerCase();
  return (activeFilter === "all" || post.category === activeFilter) && (!query || text.includes(query));
}

function filteredPosts() {
  return state.posts.filter(postMatches).sort((a, b) => b.createdAt - a.createdAt);
}

function mediaMarkup(post, className) {
  if (post.media) {
    return `<div class="${className}"><img src="${post.media}" alt="${escapeHtml(post.title)}" /></div>`;
  }
  return `<div class="${className}" aria-hidden="true">${post.emoji || "🐾"}</div>`;
}

function authorKeyForPost(post) {
  return post.userId ? `user:${post.userId}` : `author:${post.author || "Ranger Alex"}`;
}

function isOwnPost(post) {
  const user = AuthService.currentUser();
  return Boolean(user && post.userId === user.id);
}

function renderMap() {
  const visiblePosts = filteredPosts();
  const visiblePhotoCount = visiblePosts.filter((post) => post.media).length;
  const countForMap = visiblePhotoCount || visiblePosts.length;
  const countLabel = `${countForMap} ${countForMap === 1 ? "photo sighting" : "photo sightings"}`;
  MapService.render(visiblePosts);

  resultCount.textContent = `${visiblePosts.length} ${visiblePosts.length === 1 ? "post" : "posts"}`;
  if (mapCountBadge) mapCountBadge.textContent = countLabel;
  postList.innerHTML = visiblePosts.map((post, index) => `
    <button class="post-card" data-post="${post.id}">
      ${index === 0 ? `<span class="newest-badge">Newest</span>` : ""}
      ${mediaMarkup(post, "post-thumb")}
      <span>
        <strong>${escapeHtml(post.location)}</strong>
        <p>${escapeHtml(post.title)} · latest nearby sighting</p>
        <p>◎ ${escapeHtml(post.distance)} away · <b>VERIFIED</b></p>
        <span class="tag-row">${post.tags.slice(0, 3).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</span>
      </span>
    </button>
  `).join("") || `<p class="form-status">No sightings found. Try another tag or category.</p>`;
}

function renderSightings() {
  const posts = state.posts.slice().sort((a, b) => b.createdAt - a.createdAt);
  if (sightingsTotal) {
    sightingsTotal.textContent = `${posts.length} ${posts.length === 1 ? "sighting" : "sightings"}`;
  }
  if (!sightingsList) return;
  sightingsList.innerHTML = posts.map((post) => `
    <button class="sighting-row" data-post="${post.id}">
      ${mediaMarkup(post, "sighting-thumb")}
      <span>
        <strong>${escapeHtml(post.title)}</strong>
        <p>${escapeHtml(post.location)} · ${timeAgo(post.createdAt)} · ${escapeHtml(post.visibility)}</p>
        <small>${escapeHtml(post.caption)}</small>
        <span class="tag-row">${post.tags.slice(0, 4).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</span>
      </span>
    </button>
  `).join("") || `<p class="form-status">No sightings yet. Add your first animal from the plus button.</p>`;
}

function openPost(id) {
  const post = state.posts.find((item) => item.id === id);
  if (!post) {
    showToast("Post not available");
    return;
  }

  selectedPostId = post.id;
  detailTitle.textContent = post.title;
  detailMeta.textContent = `${timeAgo(post.createdAt)} · ${post.distance} away`;
  const author = post.author || "Ranger Alex";
  const initial = author.slice(0, 1).toUpperCase();
  const authorKey = authorKeyForPost(post);
  const following = AuthService.isFollowing(authorKey);
  const ownPost = isOwnPost(post);
  detailCard.innerHTML = `
    ${mediaMarkup(post, "detail-media")}
    <section class="detail-author">
      <div class="avatar-small">${escapeHtml(initial)}</div>
      <div>
        <strong>${escapeHtml(author)}</strong>
        <span>Elite Tracker · ${state.posts.length * 23 + 13} sightings</span>
      </div>
      <button class="follow-button ${following ? "following" : ""}" id="follow-author" data-author-key="${escapeHtml(authorKey)}" data-author-label="${escapeHtml(author)}" ${ownPost ? "disabled" : ""}>${ownPost ? "Your post" : following ? "Following" : "Follow"}</button>
    </section>
    <div class="detail-body">
      <h2>${escapeHtml(post.title)}</h2>
      <p class="detail-meta">◎ ${escapeHtml(post.location)} · ${timeAgo(post.createdAt)}</p>
      <div class="tag-row">${post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <p>${escapeHtml(post.caption)}</p>
      <div class="privacy-note">Protection active: ${post.approximate ? "location blurred" : "location sharing is off"} · ${post.delayed ? "posted with delay" : "posted now"} · ${escapeHtml(post.visibility)}</div>
      <div class="detail-actions">
        <button id="like-post">Track</button>
        <button id="detail-chat">Chat</button>
        <button id="detail-report">Report</button>
      </div>
    </div>
    <section class="community-block">
      <h2>Community (${Math.max(17, state.messages.length + 14)})</h2>
      <div class="comment-box">
        <div class="comment-avatar">${escapeHtml(initial)}</div>
        <textarea placeholder="Add a respectful comment..."></textarea>
      </div>
      <article class="comment">
        <div class="comment-avatar">B</div>
        <div>
          <strong>BirdTrail_22 <span class="detail-meta">30m ago</span></strong>
          <p>Pretty rare to spot this species this close to the walking trail. Thanks for keeping the location blurred.</p>
        </div>
      </article>
      <article class="comment">
        <div class="comment-avatar">N</div>
        <div>
          <strong>NatureLens_CA <span class="detail-meta">45m ago</span></strong>
          <p>The safety note makes this easier to share responsibly.</p>
        </div>
      </article>
    </section>
  `;
  MapService.focus(post);
  MapService.render(filteredPosts());
  showScreen("detail-screen");
}

function renderProfile() {
  const user = AuthService.currentUser();
  const userPosts = user ? state.posts.filter((post) => !post.userId || post.userId === user.id) : state.posts;
  if (user) {
    profileAvatar.textContent = user.displayName.slice(0, 1).toUpperCase();
    profileTitle.textContent = user.displayName;
    profileBio.textContent = user.bio;
    accountVisibility.textContent = `${user.visibility} account`;
    profileNameInput.value = user.displayName;
    profileBioInput.value = user.bio;
    profileVisibilityInput.value = user.visibility;
  }
  profilePostCount.textContent = userPosts.length;
  if (profileFollowingCount) profileFollowingCount.textContent = user?.following?.length || 0;
  profileGrid.innerHTML = userPosts
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((post) => {
      if (post.media) return `<button class="profile-tile" data-post="${post.id}"><img src="${post.media}" alt="${escapeHtml(post.title)}" /></button>`;
      return `<button class="profile-tile" data-post="${post.id}">${post.emoji || "🐾"}</button>`;
    })
    .join("");
}

function renderChat() {
  const room = chatRooms[activeChatRoom] || chatRooms["near-me"];
  if (chatHeading) chatHeading.textContent = room.heading || "Nearby Rooms";
  if (chatRoomTitle) chatRoomTitle.textContent = room.title;
  if (chatRoomCopy) chatRoomCopy.textContent = room.copy;
  if (chatInput) chatInput.placeholder = room.placeholder || "Message nearby...";
  document.querySelectorAll("[data-chat-room]").forEach((button) => {
    button.classList.toggle("active", button.dataset.chatRoom === activeChatRoom);
  });
  const roomMessages = state.messages.filter((message) => (message.room || "near-me") === activeChatRoom);
  chatList.innerHTML = roomMessages.map((message, index) => {
    if (message.mine) {
      return `<div class="message-row mine"><div class="message-bubble">${escapeHtml(message.text)}</div></div>`;
    }

    const expiry = index === roomMessages.length - 1 ? `<div class="chat-expiry">Messages expire in 23h 50m</div>` : "";
    return `
      <div class="message-row">
        <div class="message-avatar">W</div>
        <div>
          <div class="chat-meta">${escapeHtml(message.author)} · ${timeAgo(message.createdAt)}</div>
          <div class="message-bubble">${escapeHtml(message.text)}</div>
        </div>
      </div>
      ${expiry}
    `;
	  }).join("") || `<p class="empty-chat">${escapeHtml(room.empty)}</p>`;
}

function setActiveChatRoom(roomId) {
  if (!chatRooms[roomId]) return;
  activeChatRoom = roomId;
  renderChat();
  showToast(`${chatRooms[activeChatRoom].heading || chatRooms[activeChatRoom].title} opened`);
}

function renderAll() {
  renderMap();
  renderSightings();
  renderProfile();
  renderChat();
  renderServiceStatuses();
  if (AuthService.currentUser()) {
    hideAuthGate();
  } else {
    showAuthGate();
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

cameraButton.addEventListener("click", () => showScreen("upload-screen"));

authTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-auth-mode]");
  if (!button) return;
  setAuthMode(button.dataset.authMode);
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authStatus.textContent = "";
  const email = document.querySelector("#auth-email").value;
  const password = document.querySelector("#auth-password").value;
  const validationMessage = validateAuthForm({ email, password, displayName: authDisplayName.value });
  if (validationMessage) {
    authStatus.textContent = validationMessage;
    showToast(validationMessage);
    return;
  }
  try {
    if (authMode === "signup") {
      await AuthService.signUp({ email, password, displayName: authDisplayName.value });
      showToast("Account created");
    } else {
      await AuthService.signIn({ email, password });
      showToast("Signed in");
    }
    authForm.reset();
    renderAll();
  } catch (error) {
    authStatus.textContent = error.message;
    showToast(error.message);
  }
});

document.addEventListener("click", async (event) => {
  const postButton = event.target.closest("[data-post]");
  if (postButton) {
    openPost(postButton.dataset.post);
  }

  if (event.target.matches(".back-button")) {
    showScreen("map-screen");
  }

  if (event.target.id === "detail-chat") {
    if (!requireAuth("chat nearby")) return;
    showScreen("chat-screen");
  }

  if (event.target.id === "like-post") {
    if (!requireAuth("track sightings")) return;
    showToast("Added to your watch list");
  }

  if (event.target.id === "follow-author") {
    if (!requireAuth("follow this tracker")) return;
    const following = await AuthService.toggleFollow(event.target.dataset.authorKey, event.target.dataset.authorLabel);
    renderProfile();
    openPost(selectedPostId);
    showToast(following ? "Tracker followed" : "Tracker unfollowed");
  }

  if (event.target.id === "detail-report" || event.target.id === "report-post") {
    if (!requireAuth("report content")) return;
    ReportService.create(selectedPostId);
    showToast("Report stored for moderator review");
  }
});

document.querySelector("#sightings-refresh")?.addEventListener("click", async () => {
  if (DatabaseService.ready) {
    await DatabaseService.load();
  }
  renderAll();
  showToast("Sightings refreshed");
});

document.addEventListener("click", (event) => {
  const roomButton = event.target.closest("[data-chat-room]");
  if (!roomButton) return;
  event.preventDefault();
  setActiveChatRoom(roomButton.dataset.chatRoom);
});

filterRow.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  filterRow.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
  renderMap();
});

searchInput.addEventListener("input", renderMap);

document.querySelector("#privacy-toggle").addEventListener("click", () => {
  state.locationPrivacy = !state.locationPrivacy;
  StorageService.save();
  showToast(state.locationPrivacy ? "Approximate location enabled" : "Location sharing disabled");
});

document.querySelector("#locate-button").addEventListener("click", () => MapService.locate());

mediaInput.addEventListener("change", () => {
  const file = mediaInput.files?.[0];
  if (!file) return;
  selectedMediaFile = file;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    mediaDataUrl = String(reader.result);
    mediaPreview.src = mediaDataUrl;
    mediaPicker.classList.add("has-media");
  });
  reader.readAsDataURL(file);
});

document.querySelector("#upload-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = AuthService.currentUser();
  if (!user) {
    showAuthGate();
    return;
  }
  const categoryValue = document.querySelector("#category").value.trim();
  const caption = document.querySelector("#caption").value.trim();
  const tags = normalizeTags(document.querySelector("#tags").value.trim());
  const visibility = document.querySelector("#visibility").value;
  const status = document.querySelector("#upload-status");

  if (!categoryValue || !caption || tags.length === 0) {
    status.textContent = "Add an animal, caption, and at least one hashtag.";
    return;
  }

  const title = categoryValue[0].toUpperCase() + categoryValue.slice(1);
  const category = categorizeAnimal(title);
  const postId = `post-${Date.now()}`;
  let storedMediaUrl = mediaDataUrl;
  if (selectedMediaFile) {
    status.textContent = "Uploading media...";
    const uploadResult = await DatabaseService.uploadMedia(selectedMediaFile, user.id, postId);
    if (uploadResult.ok && uploadResult.url) {
      storedMediaUrl = uploadResult.url;
    } else if (DatabaseService.ready) {
      status.textContent = uploadResult.message;
      showToast(`Media upload failed: ${uploadResult.message}`);
      return;
    }
  }

  const newPost = {
    id: postId,
    title,
    category,
    caption,
    location: "UCI campus fuzzy area",
    distance: "0.1 mi",
    createdAt: Date.now(),
    tags,
    emoji: category === "Bird" ? "🦆" : category === "Mammal" ? "🐾" : "🦎",
    visibility,
    delayed: document.querySelector("#delay-post").checked,
    approximate: document.querySelector("#approx-location").checked,
    media: storedMediaUrl,
    latlng: PrivacyService.campusRandomLatLng(),
    userId: user.id,
    author: user.displayName
  };

  state.posts.unshift(newPost);
  selectedPostId = newPost.id;
  StorageService.save();
  const databaseResult = await DatabaseService.savePost(newPost);
  event.target.reset();
  mediaDataUrl = "";
  selectedMediaFile = null;
  mediaPreview.removeAttribute("src");
  mediaPicker.classList.remove("has-media");
  document.querySelector("#approx-location").checked = true;
  document.querySelector("#delay-post").checked = true;
  status.textContent = "";
  renderAll();
  showScreen("map-screen");
  MapService.focus(newPost);
  if (databaseResult.ok) {
    showToast(newPost.delayed ? "Sighting saved to Supabase with privacy delay" : "Sighting saved to Supabase");
  } else {
    showToast(databaseResult.message);
  }
});

document.querySelector("#cancel-upload").addEventListener("click", () => {
  document.querySelector("#upload-form").reset();
  mediaDataUrl = "";
  selectedMediaFile = null;
  mediaPreview.removeAttribute("src");
  mediaPicker.classList.remove("has-media");
  showScreen("map-screen");
});

document.querySelector("#chat-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = AuthService.currentUser();
  if (!user) {
    showAuthGate();
    return;
  }
  const input = document.querySelector("#chat-input");
  const text = input.value.trim();
  if (!text) return;

  state.messages.push({
    id: `msg-${Date.now()}`,
    text,
    author: user.displayName,
    mine: true,
    room: activeChatRoom,
    userId: user.id,
    createdAt: Date.now()
  });
  input.value = "";
  StorageService.save();
  const databaseResult = await DatabaseService.saveMessage(state.messages[state.messages.length - 1]);
  if (!databaseResult.ok) showToast(databaseResult.message);
  renderChat();
});

document.querySelector("#reset-data").addEventListener("click", () => {
  StorageService.reset();
  renderAll();
  showToast("Demo data reset to UCI campus");
});

document.querySelector("#logout-button").addEventListener("click", async () => {
  await AuthService.signOut();
  profileForm.hidden = true;
  renderAll();
  showToast("Signed out");
});

document.querySelector("#edit-profile-button").addEventListener("click", () => {
  if (!requireAuth("edit your profile")) return;
  profileForm.hidden = !profileForm.hidden;
});

accountVisibility.addEventListener("click", () => {
  if (!requireAuth("change account visibility")) return;
  const user = AuthService.currentUser();
  const next = user.visibility === "Public" ? "Nearby only" : user.visibility === "Nearby only" ? "Private" : "Public";
  AuthService.updateProfile({ displayName: user.displayName, bio: user.bio, visibility: next });
  renderProfile();
  showToast(`Visibility set to ${next}`);
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  AuthService.updateProfile({
    displayName: profileNameInput.value,
    bio: profileBioInput.value,
    visibility: profileVisibilityInput.value
  });
  profileForm.hidden = true;
  renderProfile();
  showToast("Profile updated");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

async function boot() {
  renderServiceStatuses();
  DatabaseService.init();
  MapService.init();
  await AuthService.restoreSession();
  if (DatabaseService.ready) {
    await DatabaseService.load();
    DatabaseService.subscribeToMessages();
    showToast("Connected to Supabase database");
  }
  setAuthMode("signin");
  renderAll();
}

boot();
