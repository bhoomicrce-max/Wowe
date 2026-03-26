/**
 * Database Configuration
 * In-memory database for WorldWeave
 * Can be extended to use MongoDB, PostgreSQL, etc.
 */

const Event = require('../models/Event');
const Category = require('../models/Category');
const Host = require('../models/Host');

class Database {
  constructor() {
    this.events = [];
    this.categories = [];
    this.hosts = [];
    this.ratings = {};
    this.bookings = {};
    this.payments = {};
    this.nextEventId = 1;
    this.nextBookingId = 1;
    
    // Initialize with default data
    this.initializeDefaults();
  }

  initializeDefaults() {
    // Initialize Categories
    this.categories = [
      new Category({ id: 'run', name: 'Run Clubs', emoji: '🏃', color: '#FF6B6B' }),
      new Category({ id: 'nightclub', name: 'Night Clubs', emoji: '🎉', color: '#A78BFA' }),
      new Category({ id: 'cafe', name: 'Cafe Events', emoji: '☕', color: '#D4A574' }),
      new Category({ id: 'comedy', name: 'Standups', emoji: '🎭', color: '#FCD34D' }),
      new Category({ id: 'workshop', name: 'Workshops', emoji: '🛠️', color: '#60A5FA' }),
      new Category({ id: 'trek', name: 'Treks', emoji: '⛰️', color: '#34D399' }),
      new Category({ id: 'party', name: 'House Parties', emoji: '🎊', color: '#EC4899' })
    ];

    // Initialize Hosts
    this.hosts = [
      new Host({
        id: 1,
        name: 'Alex Runner',
        avatar: '🏃',
        bio: 'Running enthusiast & community builder',
        verified: true,
        eventsHosted: 12,
        rating: 4.8,
        reviews: 34,
        followers: 156,
        hostRing: { hosting: 45, engagement: 38, growth: 42 }
      }),
      new Host({
        id: 2,
        name: 'DJ Nova',
        avatar: '🎧',
        bio: 'Music curator & nightlife expert',
        verified: true,
        eventsHosted: 28,
        rating: 4.9,
        reviews: 89,
        followers: 523,
        hostRing: { hosting: 92, engagement: 88, growth: 85 },
        boostedVisibility: true
      }),
      new Host({
        id: 3,
        name: 'Coffee Connoisseur',
        avatar: '☕',
        bio: 'Coffee lover connecting bean enthusiasts',
        verified: false,
        eventsHosted: 8,
        rating: 4.7,
        reviews: 19,
        followers: 89,
        hostRing: { hosting: 28, engagement: 25, growth: 31 }
      })
    ];

    // Initialize Events
    this.events = [
      new Event({
        id: this.nextEventId++,
        title: 'Morning Run Club - Riverside Loop',
        category: 'run',
        emoji: '🏃',
        date: '2026-03-28 06:30 AM',
        location: 'Central Park, Downtown',
        description: 'Join us for an energetic morning run through scenic riverside paths.',
        xp: 15,
        color: '#FF6B6B',
        hostId: 1,
        price: 0,
        maxCapacity: 50,
        attendees: 24,
        rating: 4.8,
        reviews: 12
      }),
      new Event({
        id: this.nextEventId++,
        title: 'Indie Dance Night at The Groove',
        category: 'nightclub',
        emoji: '🎉',
        date: '2026-03-30 10:00 PM',
        location: 'The Groove Club, Arts District',
        description: 'Experience cutting-edge indie and electronic music with top local DJs.',
        xp: 25,
        color: '#A78BFA',
        hostId: 2,
        price: 35,
        maxCapacity: 450,
        attendees: 342,
        rating: 4.9,
        reviews: 89
      }),
      new Event({
        id: this.nextEventId++,
        title: 'Specialty Coffee Tasting',
        category: 'cafe',
        emoji: '☕',
        date: '2026-03-29 04:00 PM',
        location: 'Bean Theory Café, Midtown',
        description: 'Discover single-origin coffees from around the world with expert guidance.',
        xp: 10,
        color: '#D4A574',
        hostId: 3,
        price: 12,
        maxCapacity: 30,
        attendees: 18,
        rating: 4.7,
        reviews: 19
      }),
      new Event({
        id: this.nextEventId++,
        title: 'Stand-Up Comedy Night - Raw & Unfiltered',
        category: 'comedy',
        emoji: '🎭',
        date: '2026-03-31 08:00 PM',
        location: 'The Comedy Vault, Downtown',
        description: 'Fresh local comedians bringing their best material. Arrive early for good seats!',
        xp: 20,
        color: '#FCD34D',
        hostId: 2,
        price: 20,
        maxCapacity: 220,
        attendees: 156,
        rating: 4.6,
        reviews: 41
      }),
      new Event({
        id: this.nextEventId++,
        title: 'Web Development & Design Workshop',
        category: 'workshop',
        emoji: '🛠️',
        date: '2026-04-02 02:00 PM',
        location: 'Tech Hub Campus, Innovation District',
        description: 'Build modern responsive websites from scratch. Learn HTML, CSS, and JavaScript.',
        xp: 30,
        color: '#60A5FA',
        hostId: 1,
        price: 45,
        maxCapacity: 60,
        attendees: 45,
        rating: 4.8,
        reviews: 23
      }),
      new Event({
        id: this.nextEventId++,
        title: 'Mountain Trek to Crystal Peak',
        category: 'trek',
        emoji: '⛰️',
        date: '2026-04-05 08:00 AM',
        location: 'Trailhead at Mt. Vista, 1hr from city',
        description: 'Challenging 8-mile trek with stunning summit views. Moderate difficulty, full day.',
        xp: 50,
        color: '#34D399',
        hostId: 1,
        price: 0,
        maxCapacity: 30,
        attendees: 32,
        rating: 4.9,
        reviews: 45
      }),
      new Event({
        id: this.nextEventId++,
        title: 'Rooftop House Party - Spring Vibes',
        category: 'party',
        emoji: '🎊',
        date: '2026-04-06 09:00 PM',
        location: 'Central Tower Rooftop, Downtown',
        description: 'Exclusive rooftop gathering with live DJ and panoramic city views.',
        xp: 35,
        color: '#EC4899',
        hostId: 2,
        price: 50,
        maxCapacity: 120,
        attendees: 89,
        rating: 4.7,
        reviews: 34
      }),
      new Event({
        id: this.nextEventId++,
        title: 'Trail Running - Sunset Canyon',
        category: 'run',
        emoji: '🏃',
        date: '2026-04-09 05:30 PM',
        location: 'Canyon Trail Entrance, Nature Reserve',
        description: 'Scenic evening trail run with stunning sunset views. 6km intermediate level.',
        xp: 20,
        color: '#FF8C42',
        hostId: 1,
        price: 0,
        maxCapacity: 25,
        attendees: 19,
        rating: 4.8,
        reviews: 8
      }),
      new Event({
        id: this.nextEventId++,
        title: 'Jazz Night - Live Performances',
        category: 'nightclub',
        emoji: '🎉',
        date: '2026-04-10 09:00 PM',
        location: 'Blue Note Lounge, Arts District',
        description: 'World-class jazz performances in an intimate setting with craft cocktails.',
        xp: 22,
        color: '#4F46E5',
        hostId: 2,
        price: 30,
        maxCapacity: 100,
        attendees: 78,
        rating: 4.9,
        reviews: 56
      })
    ];
  }

  // Event methods
  getAllEvents() {
    return this.events.map(e => e.toJSON());
  }

  getEventById(id) {
    return this.events.find(e => e.id === id);
  }

  getEventsByCategory(category) {
    return this.events
      .filter(e => e.category === category)
      .map(e => e.toJSON());
  }

  searchEvents(query) {
    const q = query.toLowerCase();
    return this.events
      .filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      )
      .map(e => e.toJSON());
  }

  createEvent(eventData) {
    const event = new Event({
      id: this.nextEventId++,
      ...eventData
    });
    this.events.unshift(event);
    return event.toJSON();
  }

  updateEvent(id, updates) {
    const event = this.getEventById(id);
    if (!event) return null;
    
    Object.assign(event, updates);
    event.updatedAt = new Date().toISOString();
    return event.toJSON();
  }

  deleteEvent(id) {
    const index = this.events.findIndex(e => e.id === id);
    if (index > -1) {
      this.events.splice(index, 1);
      return true;
    }
    return false;
  }

  // Category methods
  getAllCategories() {
    return this.categories.map(c => c.toJSON());
  }

  getCategoryById(id) {
    return this.categories.find(c => c.id === id);
  }

  getCategoryEvents(categoryId) {
    return this.events
      .filter(e => e.category === categoryId)
      .map(e => e.toJSON());
  }

  // Host methods
  getAllHosts() {
    return this.hosts.map(h => h.toJSON());
  }

  getHostById(id) {
    return this.hosts.find(h => h.id === id);
  }

  getHostEvents(hostId) {
    return this.events
      .filter(e => e.hostId === hostId)
      .map(e => e.toJSON());
  }

  // Booking methods
  addBooking(eventId, userId) {
    const event = this.getEventById(eventId);
    if (!event) return null;

    const bookingId = this.nextBookingId++;
    this.bookings[bookingId] = {
      id: bookingId,
      eventId,
      userId,
      bookingDate: new Date().toISOString(),
      xpAwarded: Math.floor(event.xp * 0.3),
      status: 'confirmed'
    };

    event.addAttendee(userId);
    return this.bookings[bookingId];
  }

  cancelBooking(eventId, userId) {
    const event = this.getEventById(eventId);
    if (!event) return false;
    return event.removeAttendee(userId);
  }

  // Payment methods
  createPayment(eventId, userId, amount) {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.payments[transactionId] = {
      id: transactionId,
      eventId,
      userId,
      amount,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    return this.payments[transactionId];
  }

  getPaymentHistory(userId) {
    return Object.values(this.payments).filter(p => p.userId === userId);
  }

  // Utility methods
  getStats() {
    return {
      totalEvents: this.events.length,
      totalHosts: this.hosts.length,
      totalCategories: this.categories.length,
      totalAttendees: this.events.reduce((sum, e) => sum + e.attendees, 0),
      totalRevenue: Object.values(this.payments).reduce((sum, p) => sum + p.amount, 0)
    };
  }
}

// Singleton instance
const db = new Database();

module.exports = db;
