const Category = require('../models/Category');
const Place = require('../models/Place');

/**
 * @desc   Get all categories with active place counts
 * @route  GET /api/categories
 * @access Public (Tourist & Admin)
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 }).lean();

    // Get count of places per category
    const counts = await Place.aggregate([
      {
        $group: {
          _id: { $toLower: '$category' },
          count: { $sum: 1 }
        }
      }
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      placeCount: countMap[cat.name.toLowerCase()] || 0
    }));

    res.json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a category
 * @route  POST /api/categories
 * @access Private (Admin only)
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, color, displayOrder } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || '',
      icon: icon || 'tag',
      color: color || '#0f766e',
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a category
 * @route  PUT /api/categories/:id
 * @access Private (Admin only)
 */
const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (req.body.name && req.body.name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const existing = await Category.findOne({
        name: { $regex: new RegExp(`^${req.body.name.trim()}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Another category with this name already exists'
        });
      }
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a category
 * @route  DELETE /api/categories/:id
 * @access Private (Admin only)
 */
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if any places use this category
    const inUse = await Place.findOne({ category: { $regex: new RegExp(`^${category.name}$`, 'i') } });
    if (inUse) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.name}" because it is currently assigned to one or more places`
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
