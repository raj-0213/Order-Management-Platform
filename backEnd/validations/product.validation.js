const Joi = require('joi');
const {Product} = require('../models');

const productSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Product name cannot be empty",
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name must be at most 50 characters",
  }),
  // wsCode: Joi.number().integer().min(0).required().messages({
  //   "number.base": "WS Code must be an integer",
  //   "number.min": "WS Code must be a non-negative number",
  // }),

  wsCode: Joi.number().integer().min(0).required().external(async (value) => {
    // Asynchronous database check for wsCode uniqueness
    const existingProduct = await Product.findOne({ where: { wsCode: value } });
    if (existingProduct) {
      throw new Error("WS Code must be unique");
    }
    return value; // Proceed if the check passes
  }).messages({
    "number.base": "WS Code must be an integer",
    "number.min": "WS Code must be a non-negative number",
  }),
  
  salesPrice: Joi.number().positive().precision(2).required().messages({
    "number.base": "Sales Price must be a valid number",
    "number.positive": "Sales Price must be greater than 0",
    "number.precision": "Sales Price must have at most 2 decimal places",
  }),
  mrp: Joi.number().positive().precision(2).required().messages({
    "number.base": "MRP must be a valid number",
    "number.positive": "MRP must be greater than 0",
    "number.precision": "MRP must have at most 2 decimal places",
  }),
  packageSize: Joi.number().positive().precision(2).required().messages({
    "number.base": "Package Size must be a valid number",
    "number.positive": "Package Size must be greater than 0",
    "number.precision": "Package Size must have at most 2 decimal places",
  }),

  tags: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Tags must be an array of strings",
  }),

  categoryId: Joi.number().integer().positive().required().messages({
    "number.base": "Category ID must be a valid integer",
    "number.positive": "Category ID must be greater than 0",
  }),
});

module.exports = { productSchema };
