/**
 * WorldWeave Backend Server
 * Express.js API server with modular architecture
 */

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

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// HEALTH & STATUS ENDPOINTS
// ============================================

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    app: "worldweave-backend",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/stats", (req, res) => {
  try {
    const stats = db.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/bootstrap", (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        events: db.getAllEvents(),
        categories: db.getAllCategories(),
        hosts: db.getAllHosts(),
        stats: db.getStats()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// API ROUTES
// ============================================

// Events API
app.use("/api/events", eventsRouter);

// Categories API
app.use("/api/categories", categoriesRouter);

// Hosts API
app.use("/api/hosts", hostsRouter);

// ============================================
// PAGE ROUTES
// ============================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/events", (req, res) => {
  res.sendFile(path.join(__dirname, "events.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "profile.html"));
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║         🌍 WorldWeave Backend Server Running 🌍               ║
╚════════════════════════════════════════════════════════════════╝

  Server:   http://localhost:${PORT}
  API:      http://localhost:${PORT}/api
  Health:   http://localhost:${PORT}/api/health
  
  Available Endpoints:
  ✓ Events:      /api/events
  ✓ Categories:  /api/categories
  ✓ Hosts:       /api/hosts
  ✓ Stats:       /api/stats
  
  Pages:
  ✓ Home:        /
  ✓ Events:      /events
  ✓ Profile:     /profile

  Database: In-memory (can be extended to MongoDB/PostgreSQL)
  Status: Ready for connections
  
`);
});

module.exports = app;
