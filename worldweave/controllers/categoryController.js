/**
 * Category Controller
 * Handles all category-related operations
 */

const db = require('../config/database');

class CategoryController {
  // Get all categories
  static getAllCategories(req, res) {
    try {
      const categories = db.getAllCategories();

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get category by ID
  static getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = db.getCategoryById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: category.toJSON()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get events in category with pagination
  static getCategoryEvents(req, res) {
    try {
      const { categoryId } = req.params;
      const { limit = 50, offset = 0, sort = 'newest' } = req.query;

      const category = db.getCategoryById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }

      let events = db.getCategoryEvents(categoryId);

      // Sort
      if (sort === 'trending') {
        events.sort((a, b) => b.shares - a.shares);
      } else if (sort === 'rating') {
        events.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'newest') {
        events.reverse();
      }

      // Pagination
      const paginated = events.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

      res.json({
        success: true,
        category: category.toJSON(),
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
}

module.exports = CategoryController;
