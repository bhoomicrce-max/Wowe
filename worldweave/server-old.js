const express = require("express");
const path = require("path");
const cors = require("cors");

// Import routes
const eventsRouter = require("./routes/events");
const categoriesRouter = require("./routes/categories");
const hostsRouter = require("./routes/hosts");

// Import middleware
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

// Import database
const db = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const hosts = {
  1: {
    id: 1,
    name: "Alex Runner",
    avatar: "🏃",
    bio: "Running enthusiast & community builder",
    eventsHosted: 12,
    rating: 4.8,
    reviews: 34,
    followers: 156,
    hostRing: { hosting: 45, engagement: 38, growth: 42 },
    verified: true
  },
  2: {
    id: 2,
    name: "DJ Nova",
    avatar: "🎧",
    bio: "Music curator & nightlife expert",
    eventsHosted: 28,
    rating: 4.9,
    reviews: 89,
    followers: 523,
    hostRing: { hosting: 92, engagement: 88, growth: 85 },
    verified: true,
    boostedVisibility: true
  },
  3: {
    id: 3,
    name: "Coffee Connoisseur",
    avatar: "☕",
    bio: "Coffee lover connecting bean enthusiasts",
    eventsHosted: 8,
    rating: 4.7,
    reviews: 19,
    followers: 89,
    hostRing: { hosting: 28, engagement: 25, growth: 31 },
    verified: false
  }
};

let events = [
  {
    id: 1,
    title: "Morning Run Club - Riverside Loop",
    category: "run",
    emoji: "🏃",
    date: "2026-03-28 06:30 AM",
    location: "Central Park, Downtown",
    attendees: 24,
    description:
      "Join us for an energetic morning run through scenic riverside paths. Perfect for beginners and experienced runners. We'll cover 5km at a moderate pace with a cool-down stretch.",
    xp: 15,
    color: "#FF6B6B",
    hostId: 1,
    price: 0,
    maxCapacity: 50,
    spotsRemaining: 26,
    rating: 4.8,
    reviews: 12,
    gallery: [],
    goingUsers: [
      { id: 101, name: "Sarah", avatar: "👩" },
      { id: 102, name: "Mike", avatar: "👨" },
      { id: 103, name: "Lisa", avatar: "👩" }
    ]
  },
  {
    id: 2,
    title: "Indie Dance Night at The Groove",
    category: "nightclub",
    emoji: "🎉",
    date: "2026-03-30 10:00 PM",
    location: "The Groove Club, Arts District",
    attendees: 342,
    description:
      "Experience cutting-edge indie and electronic music. Top local DJs spinning until 4 AM. Come solo or bring friends—everyone's welcome!",
    xp: 25,
    color: "#A78BFA",
    hostId: 2,
    price: 35,
    maxCapacity: 450,
    spotsRemaining: 108,
    rating: 4.9,
    reviews: 89,
    gallery: [],
    goingUsers: [
      { id: 104, name: "Noah", avatar: "🧑" },
      { id: 105, name: "Ava", avatar: "👩" }
    ]
  },
  {
    id: 3,
    title: "Specialty Coffee Tasting",
    category: "cafe",
    emoji: "☕",
    date: "2026-03-29 04:00 PM",
    location: "Bean Theory Café, Midtown",
    attendees: 18,
    description:
      "Discover single-origin coffees from around the world. Expert barista will guide you through flavor profiles and brewing techniques.",
    xp: 10,
    color: "#D4A574",
    hostId: 3,
    price: 12,
    maxCapacity: 30,
    spotsRemaining: 12,
    rating: 4.7,
    reviews: 19,
    gallery: [],
    goingUsers: [{ id: 106, name: "Riya", avatar: "👩" }]
  },
  {
    id: 4,
    title: "Stand-Up Comedy Night - Raw & Unfiltered",
    category: "comedy",
    emoji: "🎭",
    date: "2026-03-31 08:00 PM",
    location: "The Comedy Vault, Downtown",
    attendees: 156,
    description:
      "Fresh local comedians bringing their best material. Intimate venue, hilarious performances. Arrive early for good seats!",
    xp: 20,
    color: "#FCD34D",
    hostId: 2,
    price: 20,
    maxCapacity: 220,
    spotsRemaining: 64,
    rating: 4.6,
    reviews: 41,
    gallery: [],
    goingUsers: []
  }
];

let hostDrafts = {};
let hostAnalytics = {};
let paymentTransactions = {};
let nextEventId = 1000;

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "worldweave-backend" });
});

app.get("/api/bootstrap", (req, res) => {
  res.json({
    hosts,
    events,
    stats: {
      totalEvents: events.length,
      activeUsers: "1.2K",
      xpReward: "2-50"
    }
  });
});

app.get("/api/events", (req, res) => {
  const { category, q } = req.query;
  let filtered = [...events];

  if (category && category !== "all") {
    filtered = filtered.filter((event) => event.category === category);
  }

  if (q) {
    const query = String(q).toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
    );
  }

  res.json(filtered);
});

app.get("/api/events/:id", (req, res) => {
  const event = events.find((item) => item.id === Number(req.params.id));
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  res.json(event);
});

app.post("/api/events/:id/book", (req, res) => {
  const event = events.find((item) => item.id === Number(req.params.id));
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (event.spotsRemaining <= 0) {
    return res.status(400).json({ error: "No spots remaining" });
  }

  event.spotsRemaining -= 1;
  event.attendees += 1;

  res.json({
    success: true,
    event,
    booking: {
      eventId: event.id,
      awardedXP: Math.floor(event.xp * 0.3),
      activityRingXP: 50
    }
  });
});

app.post("/api/events/:id/share", (req, res) => {
  const event = events.find((item) => item.id === Number(req.params.id));
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  event.shares = (event.shares || 0) + 1;

  res.json({
    success: true,
    eventId: event.id,
    shares: event.shares
  });
});

app.post("/api/host/events", (req, res) => {
  const { title, category, hostId = 1, price = 15 } = req.body || {};

  if (!title || !category) {
    return res.status(400).json({ error: "title and category are required" });
  }

  const host = hosts[hostId];
  if (!host) {
    return res.status(404).json({ error: "Host not found" });
  }

  const event = {
    id: nextEventId++,
    title,
    category,
    emoji:
      category === "run"
        ? "🏃"
        : category === "nightclub"
          ? "🎉"
          : category === "cafe"
            ? "☕"
            : "✨",
    date: "2026-04-15 07:00 PM",
    location: "WorldWeave Featured Venue",
    attendees: 0,
    description: `Join us for ${title}. This AI-assisted event has been published and is ready for bookings.`,
    xp: 18,
    color: "#60A5FA",
    hostId,
    price,
    maxCapacity: 100,
    spotsRemaining: 100,
    rating: 4.7,
    reviews: 0,
    gallery: [],
    goingUsers: []
  };

  hostDrafts[event.id] = { ...event, status: "published" };
  hostAnalytics[event.id] = { views: 0, bookings: 0, revenue: 0 };
  events.unshift(event);

  res.status(201).json({ success: true, event });
});

app.get("/api/hosts/:id/analytics", (req, res) => {
  const hostId = Number(req.params.id);
  const analytics = Object.entries(hostAnalytics)
    .filter(([, value]) => {
      const event = events.find((item) => item.id === Number(Object.keys(hostAnalytics).find((key) => hostAnalytics[key] === value)));
      return event && event.hostId === hostId;
    })
    .map(([eventId, value]) => ({ eventId: Number(eventId), ...value }));

  res.json({
    hostId,
    analytics
  });
});

app.post("/api/payments/create", (req, res) => {
  const { eventId, attendeeId = "Explorer" } = req.body || {};
  const event = events.find((item) => item.id === Number(eventId));

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const transactionId = `txn_${Date.now()}`;
  paymentTransactions[transactionId] = {
    id: transactionId,
    eventId: event.id,
    attendeeId,
    amount: event.price,
    status: "completed",
    createdAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    transactionId,
    paymentId: `mock_pay_${Date.now()}`,
    amount: event.price
  });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/events", (req, res) => res.sendFile(path.join(__dirname, "events.html")));
app.get("/profile", (req, res) => res.sendFile(path.join(__dirname, "profile.html")));

app.listen(PORT, () => {
  console.log(`WorldWeave server running at http://localhost:${PORT}`);
});
