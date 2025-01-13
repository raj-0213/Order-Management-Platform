const { Product } = require("../models");

exports.createProduct = async (req, res) => {
  try {
    const { name, wsCode, salesPrice, mrp, packageSize, tags, categoryId } = req.body;
    
    const imageUrls = req.files.map((file) => file.path);
    
    const product = await Product.create({
      name,
      wsCode,
      salesPrice,
      mrp,
      packageSize,
      tags: tags ? JSON.parse(tags) : [],
      categoryId,
      images: imageUrls, 
    });

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, wsCode, salesPrice, mrp, packageSize, tags, categoryId } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product details
    const imageUrls = req.files?.map((file) => file.path) || product.images;

    const updatedProduct = await product.update({
      name: name || product.name,
      wsCode: wsCode || product.wsCode,
      salesPrice: salesPrice || product.salesPrice,
      mrp: mrp || product.mrp,
      packageSize: packageSize || product.packageSize,
      tags: tags ? JSON.parse(tags) : product.tags,
      categoryId: categoryId || product.categoryId,
      images: imageUrls,
    });

    res.status(200).json({ updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
