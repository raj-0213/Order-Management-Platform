const { body } = require("express-validator");

exports.validateProduct = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("description").notEmpty().withMessage("Product description is required"),
  body("wsCode")
    .isInt({ min: 1 })
    .withMessage("WS Code must be a non-negative integer"),
  body("salesPrice")
    .isFloat({ min: 0.01 })
    .withMessage("Sales Price must be a valid number greater than 0"),
  body("mrp").isFloat({ min: 0.01 }).withMessage("MRP must be a valid number greater than 0"),
  body("packageSize")
    .isFloat({ min: 0 })
    .withMessage("Package Size must be a valid number greater than 0"),
  body("stockQuantity")
    .isInt({ min: 1 })
    .withMessage("Stock Quantity must be a non-negative integer"),
  body("tags")
    .optional()
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Tags must be an array of strings");
      }
      return true;
    }),
  body("categoryId")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
];
