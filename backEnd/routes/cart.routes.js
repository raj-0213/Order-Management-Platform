const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cart.controller');

// Add product to cart
router.post('/add', addToCart);

// Get user's cart
router.get('/:userId', getCart);

// Remove product from cart
router.delete('/:userId/:productId', removeFromCart);

module.exports = router;
