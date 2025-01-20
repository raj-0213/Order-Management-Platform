const { Product,Category } = require("../models");
const { validationResult } = require("express-validator");


exports.createProduct = async (req, res) => {
  try {

    const { name, description, wsCode, salesPrice, mrp, packageSize, stockQuantity, tags, categoryId } = req.body;
    // console.log(req.body);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const imageUrls = req.files.map((file) => file.path);
    // console.log(req.files);

    // const existingProduct = await Product.findOne({ where: { wsCode } });

    // if (existingProduct) {
    //   return res.status(400).json({ error: "WS Code must be unique" });
    // }

    // console.log(req.body);

    const product = await Product.create({
      name,
      description,
      wsCode,
      salesPrice,
      mrp,
      packageSize,
      stockQuantity,
      tags: tags ? JSON.parse(tags) : [],
      categoryId,
      images: imageUrls, 
    });

    res.status(201).json({ product });
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
    const { name, wsCode, salesPrice, mrp, packageSize, stockQuantity, tags, categoryId, images } = req.body;
    console.log(req.body);
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product details
    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);

    // Handle images: prioritize the new ones from req.files, or use the existing product images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path); // New image URLs from Cloudinary
    } else if (images && Array.isArray(images)) {
      imageUrls = images; // Use updated image URLs passed in the request body
    } else {
      imageUrls = product.images; // Retain existing images if no new ones are provided
    }

    // console.log(imageUrls); // Check the image URLs before updating

    // Update the product
    const updatedProduct = await product.update({
      name: name ?? product.name,
      wsCode: wsCode !== undefined ? Number(wsCode) : product.wsCode,
      salesPrice: salesPrice !== undefined ? Number(salesPrice) : product.salesPrice,
      mrp: mrp !== undefined ? Number(mrp) : product.mrp,
      packageSize: packageSize !== undefined ? Number(packageSize) : product.packageSize,
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : product.stockQuantity, // Fix here
      tags: parsedTags,
      categoryId: categoryId !== undefined ? Number(categoryId) : product.categoryId,
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

// Updated getAllProducts with search and pagination functionality
const { Op,Sequelize  } = require("sequelize");

// exports.getAllProducts = async (req, res) => {
//   try {
//     const { search, page = 1,limit=16 } = req.query;

//     // console.log("Request Query: ", req.query); 

//     // Default pagination settings
//     const pageNumber = parseInt(page, 10);
//     const pageSize = parseInt(limit,10);   
//     const offset = (pageNumber - 1) * pageSize;

//     // Initialize the search condition object
//     let searchCondition = {};
    
//      // Count the total number of products matching the search condition
//      const totalProducts = await Product.count({
//       where: searchCondition,
//     });

//     if (search) {
//       // Apply a general search condition for both `name` and `wsCode`
//       searchCondition = {
//         [Op.or]: [
//           { name: { [Op.iLike]: `%${search}%` } }, // Match name partially (case-insensitive)
//           Sequelize.where(
//             Sequelize.cast(Sequelize.col("wsCode"), "TEXT"),
//             { [Op.like]: `%${search}%` } // Match wsCode partially by casting to TEXT
//           ),
//         ],
//       };
//     }

//     // Fetch products based on search condition and pagination
//     const products = await Product.findAll({
//       where: searchCondition,
//       limit: pageSize,
//       offset: offset,
//       // logging: console.log,  // This will log the raw SQL query generated by Sequelize
//     });

//     // Calculate total pages for pagination
//     const totalPages = Math.ceil(totalProducts / pageSize);

//     // Return the response with products and pagination info
//     res.status(200).json({
//       products, 
//       pagination: {
//         page: pageNumber,
//         totalPages: totalPages,
//         totalProducts: totalProducts,
//       },
//     });
//   } catch (error) {
//     console.error(error); 
//     res.status(500).json({ error: error.message });
//   }
// };


// Currently Working
exports.getAllProducts = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;
    
    // Default pagination settings
    const pageNumber = parseInt(page, 10);

    // Count the total number of products matching the search condition
    let searchCondition = {};
    if (search) {
      searchCondition = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } }, // Match name partially (case-insensitive)
          Sequelize.where(
            Sequelize.cast(Sequelize.col("wsCode"), "TEXT"),
            { [Op.like]: `%${search}%` } // Match wsCode partially by casting to TEXT
          ),
        ],
      };
    }

    const totalProducts = await Product.count({
      where: searchCondition,
    });

    // Set the limit to the total number of products in the database
    const pageSize = totalProducts;

    const offset = (pageNumber - 1) * pageSize;

    // Fetch all products based on search condition and no pagination limit
    const products = await Product.findAll({
      where: searchCondition,
      limit: pageSize,  // Limit is now set to total number of products
      offset: offset,
    });

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalProducts / pageSize);

    // Return the response with products and pagination info
    res.status(200).json({
      products,
      pagination: {
        page: pageNumber,
        totalPages: totalPages,
        totalProducts: totalProducts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};




exports.getProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; // Extract categoryId from the route parameter
    const { search, page = 1, limit = 10 } = req.query;

    // Default pagination settings
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    // Initialize the search condition
    let searchCondition = { categoryId }; // Filter by categoryId

    if (search) {
      // Add search conditions for name and wsCode
      searchCondition = {
        ...searchCondition,
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          Sequelize.where(
            Sequelize.cast(Sequelize.col("wsCode"), "TEXT"),
            { [Op.like]: `%${search}%` }
          ),
        ],
      };
    }

    // Fetch products based on categoryId, search condition, and pagination
    const products = await Product.findAll({
      where: searchCondition,
      limit: pageSize,
      offset: offset,
    });

    // Count the total number of products in the specified category
    const totalProducts = await Product.count({
      where: searchCondition,
    });

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalProducts / pageSize);

    // Return the response with products and pagination info
    res.status(200).json({
      products,
      pagination: {
        page: pageNumber,
        totalPages: totalPages,
        totalProducts: totalProducts,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};



// exports.getProductBySearch = async (req, res) => {
//   try {
//     const { name, wsCode, tags, categoryId } = req.query;

//     const filters = {};

//     if (name) {
//       filters.name = { [Sequelize.Op.iLike]: `%${name}%` }; // Case-insensitive search
//     }
//     if (wsCode) {
//       filters.wsCode = wsCode;
//     }
//     if (tags) {
//       filters.tags = { [Sequelize.Op.contains]: JSON.parse(tags) }; // To match tags array
//     }
//     if (categoryId) {
//       filters.categoryId = categoryId;
//     }

//     const products = await Product.findAll({
//       where: filters,
//     });

//     if (products.length === 0) {
//       return res.status(404).json({ error: "No products found matching the search criteria" });
//     }

//     res.status(200).json({ products });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


