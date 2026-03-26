/**
 * Host Controller
 * Handles host profile and management operations
 */

const db = require('../config/database');

class HostController {
  // Get host profile
  static getHostProfile(req, res) {
    try {
      const { id } = req.params;
      const host = db.getHostById(parseInt(id));

      if (!host) {
        return res.status(404).json({
          success: false,
          error: 'Host not found'
        });
      }

      res.json({
        success: true,
        data: host.toJSON()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get host analytics
  static getHostAnalytics(req, res) {
    try {
      const { id } = req.params;
      const host = db.getHostById(parseInt(id));

      if (!host) {
        return res.status(404).json({
          success: false,
          error: 'Host not found'
        });
      }

      const hostEvents = db.getHostEvents(parseInt(id));
      const totalAttendees = hostEvents.reduce((sum, e) => sum + e.attendees, 0);
      const totalRevenue = hostEvents.reduce((sum, e) => sum + (e.price * e.attendees), 0);
      const avgRating = hostEvents.length > 0 
        ? (hostEvents.reduce((sum, e) => sum + e.rating, 0) / hostEvents.length).toFixed(2)
        : 0;

      res.json({
        success: true,
        data: {
          hostId: parseInt(id),
          hostName: host.name,
          totalEvents: host.eventsHosted,
          totalAttendees,
          totalRevenue,
          averageRating: parseFloat(avgRating),
          followers: host.followers,
          verified: host.verified,
          responseTime: host.responseTime,
          cancellationRate: host.cancellationRate,
          events: hostEvents.map(e => ({
            id: e.id,
            title: e.title,
            attendees: e.attendees,
            revenue: e.price * e.attendees,
            rating: e.rating
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get host events
  static getHostEvents(req, res) {
    try {
      const { id } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const host = db.getHostById(parseInt(id));
      if (!host) {
        return res.status(404).json({
          success: false,
          error: 'Host not found'
        });
      }

      let events = db.getHostEvents(parseInt(id));
      const paginated = events.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

      res.json({
        success: true,
        host: host.toJSON(),
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

  // Get host ratings
  static getHostRatings(req, res) {
    try {
      const { id } = req.params;
      const host = db.getHostById(parseInt(id));

      if (!host) {
        return res.status(404).json({
          success: false,
          error: 'Host not found'
        });
      }

      const hostEvents = db.getHostEvents(parseInt(id));
      const ratings = hostEvents.map(e => ({
        eventId: e.id,
        eventTitle: e.title,
        rating: e.rating,
        reviews: e.reviews
      }));

      res.json({
        success: true,
        data: {
          host: host.toJSON(),
          hostRating: host.rating,
          totalReviews: host.reviews,
          eventRatings: ratings
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update host profile
  static updateHostProfile(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const host = db.getHostById(parseInt(id));
      if (!host) {
        return res.status(404).json({
          success: false,
          error: 'Host not found'
        });
      }

      // Only allow updating certain fields
      const allowedUpdates = ['bio', 'avatar', 'responseTime'];
      
      allowedUpdates.forEach(key => {
        if (updates[key] !== undefined) {
          host[key] = updates[key];
        }
      });

      res.json({
        success: true,
        message: 'Host profile updated successfully',
        data: host.toJSON()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Follow host
  static followHost(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        });
      }

      const host = db.getHostById(parseInt(id));
      if (!host) {
        return res.status(404).json({
          success: false,
          error: 'Host not found'
        });
      }

      const result = host.addFollower(userId);

      res.json({
        success: true,
        message: result ? 'Successfully followed host' : 'Already following this host',
        data: {
          hostId: host.id,
          followers: host.followers
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Unfollow host
  static unfollowHost(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        });
      }

      const host = db.getHostById(parseInt(id));
      if (!host) {
        return res.status(404).json({
          success: false,
          error: 'Host not found'
        });
      }

      const result = host.removeFollower(userId);

      res.json({
        success: true,
        message: result ? 'Successfully unfollowed host' : 'Was not following this host',
        data: {
          hostId: host.id,
          followers: host.followers
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = HostController;
