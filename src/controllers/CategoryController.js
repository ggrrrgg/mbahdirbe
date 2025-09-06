const express = require('express');
const router = express.Router();
const { Category } = require('../models/CategoryModel');
const { authenticate } = require('../functions');

// GET all categories (public)
router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// POST new category (admin only)
router.post('/add', authenticate, async (req, res) => {
  if (!req.user.admin) return res.status(403).json({ message: 'Unauthorized' });

  try {
    const existing = await Category.findOne({ name: req.body.name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const category = new Category({ name: req.body.name });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating category' });
  }
});

// PATCH/update category (admin only)
router.patch('/update/:id', authenticate, async (req, res) => {
  if (!req.user.admin) return res.status(403).json({ message: 'Unauthorized' });

  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Category not found' });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating category' });
  }
});

// DELETE category (admin only)
router.delete('/delete/:id', authenticate, async (req, res) => {
  if (!req.user.admin) return res.status(403).json({ message: 'Unauthorized' });

  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting category' });
  }
});

module.exports = router;
