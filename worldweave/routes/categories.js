/**
 * Categories API Routes
 * Handles event category management
 */

const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

// Get all categories
router.get('/', CategoryController.getAllCategories);

// Get category by ID
router.get('/:id', CategoryController.getCategoryById);

// Get events in category with pagination
router.get('/:categoryId/events', CategoryController.getCategoryEvents);

module.exports = router;
