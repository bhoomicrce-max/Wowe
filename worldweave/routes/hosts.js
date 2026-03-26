/**
 * Hosts API Routes
 * Handles host management and analytics
 */

const express = require('express');
const router = express.Router();
const HostController = require('../controllers/hostController');

// Get host profile
router.get('/:id', HostController.getHostProfile);

// Get host analytics
router.get('/:id/analytics', HostController.getHostAnalytics);

// Get host events
router.get('/:id/events', HostController.getHostEvents);

// Get host ratings
router.get('/:id/ratings', HostController.getHostRatings);

// Update host profile
router.put('/:id', HostController.updateHostProfile);

// Follow host
router.post('/:id/follow', HostController.followHost);

// Unfollow host
router.post('/:id/unfollow', HostController.unfollowHost);

module.exports = router;
