const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // Custom validation to ensure the product name is a non-empty string
          notEmpty: {
            msg: "Product name cannot be empty",
          },
        },
      },
      wsCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
          isInt: {
            msg: "WS Code must be an integer",
          },
          min: 0, // Ensures the code is a non-negative number
        },
      },
      salesPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: {
            msg: "Sales Price must be a valid number",
          },
          min: 0.01, // Sales price should be greater than 0
        },
      },
      mrp: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: {
            msg: "MRP must be a valid number",
          },
          min: 0.01, // MRP should be greater than 0
        },
      },
      packageSize: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: {
            msg: "Package Size must be a valid number",
          },
          min: 0.01, // Package size should be greater than 0
        },
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        validate: {
          // Validate array of images (can add more custom validation for image format)
          isArray(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Images must be an array of strings");
            }
          },
        },
      },
      stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Stock Quantity must be an integer",
          },
          min: 0, // Ensure stock quantity is non-negative
        },
      }, 
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        validate: { 
          // Validate array of tags (can add more custom validation for tags)
          isArray(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Tags must be an array of strings");
            }
          },
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Category ID must be an integer",
          },
          min: 1, // Ensure the category ID is a valid positive number
        },
      },
    },
    {
      tableName: 'products', 
      timestamps: false,    
    }
  );

  return Product;
};
