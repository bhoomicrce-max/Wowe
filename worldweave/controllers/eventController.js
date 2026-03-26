/**
 * Event Controller
 * Handles all business logic for events
 */

const db = require('../config/database');

class EventController {
  // Get all events with optional filtering
  static getAllEvents(req, res) {
    try {
      const { limit = 50, offset = 0, sort = 'newest' } = req.query;
      
      let events = db.getAllEvents();

      // Sort
      if (sort === 'trending') {
        events.sort((a, b) => b.shares - a.shares);
      } else if (sort === 'rating') {
        events.sort((a, b) => b.rating - a.rating);
      } else {
        events.reverse(); // newest first
      }

      // Pagination
      const paginated = events.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

      res.json({
        success: true,
        data: paginated,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: events.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get events by category
  static getEventsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      let events = db.getEventsByCategory(category);

      if (events.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No events found for this category'
        });
      }

      const paginated = events.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

      res.json({
        success: true,
        category,
        data: paginated,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: events.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Search events
  static searchEvents(req, res) {
    try {
      const { q, limit = 50, offset = 0 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query (q) is required'
        });
      }

      let results = db.searchEvents(q);
      const paginated = results.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

      res.json({
        success: true,
        query: q,
        data: paginated,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: results.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get event by ID
  static getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = db.getEventById(parseInt(id));

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      res.json({
        success: true,
        data: event.toJSON()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new event
  static createEvent(req, res) {
    try {
      const { title, category, description, location, date, price, maxCapacity, hostId } = req.body;

      // Validation
      if (!title || !category || !description || !location || !hostId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: title, category, description, location, hostId'
        });
      }

      const host = db.getHostById(hostId);
      if (!host) {
        return res.status(404).json({
          success: false,
          error: 'Host not found'
        });
      }

      const categories = db.getAllCategories();
      const catExists = categories.some(c => c.id === category);
      if (!catExists) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category'
        });
      }

      const eventData = {
        title,
        category,
        description,
        location,
        date: date || new Date().toISOString(),
        price: price || 0,
        maxCapacity: maxCapacity || 100,
        hostId,
        emoji: this.getCategoryEmoji(category),
        xp: this.calculateXP(price)
      };

      const event = db.createEvent(eventData);
      host.incrementEventsHosted();

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update event
  static updateEvent(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const event = db.getEventById(parseInt(id));
      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      // Only allow updating certain fields
      const allowedUpdates = ['title', 'description', 'location', 'date', 'price', 'maxCapacity'];
      const filteredUpdates = {};
      
      allowedUpdates.forEach(key => {
        if (updates[key] !== undefined) {
          filteredUpdates[key] = updates[key];
        }
      });

      const updated = db.updateEvent(parseInt(id), filteredUpdates);

      res.json({
        success: true,
        message: 'Event updated successfully',
        data: updated
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete event
  static deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const event = db.getEventById(parseInt(id));

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      db.deleteEvent(parseInt(id));

      res.json({
        success: true,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Book event
  static bookEvent(req, res) {
    try {
      const { id } = req.params;
      const { userId = 'guest_' + Date.now() } = req.body;

      const event = db.getEventById(parseInt(id));
      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      if (event.isFull()) {
        return res.status(400).json({
          success: false,
          error: 'No spots remaining for this event'
        });
      }

      const booking = db.addBooking(parseInt(id), userId);

      res.status(201).json({
        success: true,
        message: 'Event booked successfully',
        data: {
          booking,
          event: event.toJSON(),
          xpAwarded: booking.xpAwarded
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Cancel booking
  static cancelBooking(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        });
      }

      const result = db.cancelBooking(parseInt(id), userId);

      if (!result) {
        return res.status(400).json({
          success: false,
          error: 'Could not cancel booking'
        });
      }

      res.json({
        success: true,
        message: 'Booking cancelled successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Share event
  static shareEvent(req, res) {
    try {
      const { id } = req.params;

      const event = db.getEventById(parseInt(id));
      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      event.shares = (event.shares || 0) + 1;

      res.json({
        success: true,
        message: 'Event shared successfully',
        data: {
          eventId: event.id,
          shares: event.shares
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get event ratings
  static getEventRatings(req, res) {
    try {
      const { id } = req.params;
      const event = db.getEventById(parseInt(id));

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      res.json({
        success: true,
        data: {
          eventId: event.id,
          rating: event.rating,
          reviews: event.reviews
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Add rating to event
  static addRating(req, res) {
    try {
      const { id } = req.params;
      const { userId, rating, review } = req.body;

      if (!userId || !rating) {
        return res.status(400).json({
          success: false,
          error: 'userId and rating are required'
        });
      }

      const event = db.getEventById(parseInt(id));
      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      // Update rating (simple average)
      const totalRating = (event.rating * event.reviews) + rating;
      event.reviews++;
      event.rating = totalRating / event.reviews;

      res.json({
        success: true,
        message: 'Rating added successfully',
        data: {
          eventId: event.id,
          newRating: event.rating,
          totalReviews: event.reviews
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Save event (wishlist)
  static saveEvent(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        });
      }

      const event = db.getEventById(parseInt(id));
      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      const result = event.saveBy(userId);

      res.json({
        success: true,
        message: result ? 'Event saved successfully' : 'Event already saved',
        data: {
          eventId: event.id,
          savedCount: event.savedBy.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Unsave event
  static unsaveEvent(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        });
      }

      const event = db.getEventById(parseInt(id));
      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      const result = event.unsaveBy(userId);

      res.json({
        success: true,
        message: result ? 'Event removed from saved' : 'Event was not saved',
        data: {
          eventId: event.id,
          savedCount: event.savedBy.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Helper methods
  static getCategoryEmoji(category) {
    const emojiMap = {
      run: '🏃',
      nightclub: '🎉',
      cafe: '☕',
      comedy: '🎭',
      workshop: '🛠️',
      trek: '⛰️',
      party: '🎊'
    };
    return emojiMap[category] || '✨';
  }

  static calculateXP(price) {
    if (price === 0) return 15;
    if (price <= 25) return 20;
    if (price <= 75) return 30;
    return 50;
  }
}

module.exports = EventController;
