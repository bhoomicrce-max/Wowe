/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.message
    });
  }

  // Not found errors
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      error: 'Resource not found'
    });
  }

  // 404 handler for undefined routes
  if (res.statusCode === 404) {
    return res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  }

  // Generic error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An unexpected error occurred'
  });
};

// 404 handler middleware
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route '${req.method} ${req.path}' not found`,
    availableRoutes: {
      events: 'GET /api/events',
      eventsByCategory: 'GET /api/events/category/:category',
      searchEvents: 'GET /api/events/search?q=query',
      eventById: 'GET /api/events/:id',
      categories: 'GET /api/categories',
      hosts: 'GET /api/hosts/:id',
      utilities: 'GET /api/stats'
    }
  });
};

module.exports = { errorHandler, notFoundHandler };
