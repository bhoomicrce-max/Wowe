/**
 * Events API Routes
 * Handles all event-related endpoints
 */

const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');

// Get all events with optional filtering
router.get('/', EventController.getAllEvents);

// Get events by category
router.get('/category/:category', EventController.getEventsByCategory);

// Search events
router.get('/search', EventController.searchEvents);

// Get event by ID
router.get('/:id', EventController.getEventById);

// Create new event (host)
router.post('/', EventController.createEvent);

// Update event
router.put('/:id', EventController.updateEvent);

// Delete event
router.delete('/:id', EventController.deleteEvent);

// Book event
router.post('/:id/book', EventController.bookEvent);

// Cancel booking
router.post('/:id/cancel-booking', EventController.cancelBooking);

// Share event
router.post('/:id/share', EventController.shareEvent);

// Get event ratings
router.get('/:id/ratings', EventController.getEventRatings);

// Add rating to event
router.post('/:id/ratings', EventController.addRating);

// Save event (wishlist)
router.post('/:id/save', EventController.saveEvent);

// Unsave event
router.post('/:id/unsave', EventController.unsaveEvent);

module.exports = router;
