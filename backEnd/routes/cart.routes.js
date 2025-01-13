const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cart.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/add', verifyToken, addToCart);

router.get('/:userId', getCart);

router.delete('/:userId/:productId', removeFromCart);

module.exports = router;