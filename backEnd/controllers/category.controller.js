const { Category } = require('../models'); // Assuming the models are located in the 'models' directory

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    // console.log(req.body);
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category with this name already exists" });
    }
    
    const category = await Category.create({ name });
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Active Categories (Exclude Soft Deleted)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isDeleted: false }, 
    });

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      res.status(200).json({ category });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const category = await Category.findByPk(id);
    if (category) {
      category.name = name || category.name;
      await category.save();
      res.status(200).json({ message: "Category updated successfully", category });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Soft Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find category that is not already deleted
    const category = await Category.findOne({ where: { id, isDeleted: false } });

    if (!category) {
      return res.status(404).json({ message: "Category not found or already deleted" });
    }

    // Soft delete the category
    await category.update({ isDeleted: true });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



