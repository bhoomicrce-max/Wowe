/**
 * Validation Utilities
 * Helper functions for input validation
 */

const validators = {
  // Validate event data
  validateEvent: (data) => {
    const errors = [];

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string');
    }

    if (!data.category || typeof data.category !== 'string') {
      errors.push('Category is required');
    }

    if (!data.description || typeof data.description !== 'string') {
      errors.push('Description is required');
    }

    if (!data.location || typeof data.location !== 'string') {
      errors.push('Location is required');
    }

    if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
      errors.push('Price must be a non-negative number');
    }

    if (data.maxCapacity !== undefined && (typeof data.maxCapacity !== 'number' || data.maxCapacity <= 0)) {
      errors.push('Max capacity must be a positive number');
    }

    if (data.hostId !== undefined && typeof data.hostId !== 'number') {
      errors.push('Host ID must be a number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate search query
  validateSearchQuery: (query) => {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return {
        isValid: false,
        error: 'Search query must be a non-empty string'
      };
    }

    if (query.length > 200) {
      return {
        isValid: false,
        error: 'Search query cannot exceed 200 characters'
      };
    }

    return { isValid: true };
  },

  // Validate pagination
  validatePagination: (limit, offset) => {
    const errors = [];

    if (limit !== undefined && (typeof limit !== 'number' || limit <= 0 || limit > 200)) {
      errors.push('Limit must be between 1 and 200');
    }

    if (offset !== undefined && (typeof offset !== 'number' || offset < 0)) {
      errors.push('Offset must be a non-negative number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate rating
  validateRating: (rating) => {
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return {
        isValid: false,
        error: 'Rating must be a number between 1 and 5'
      };
    }
    return { isValid: true };
  },

  // Validate user ID
  validateUserId: (userId) => {
    if (!userId || (typeof userId !== 'string' && typeof userId !== 'number')) {
      return {
        isValid: false,
        error: 'User ID must be provided'
      };
    }
    return { isValid: true };
  },

  // Validate category
  validateCategory: (category, validCategories) => {
    if (!validCategories.includes(category)) {
      return {
        isValid: false,
        error: `Category must be one of: ${validCategories.join(', ')}`
      };
    }
    return { isValid: true };
  }
};

module.exports = validators;
