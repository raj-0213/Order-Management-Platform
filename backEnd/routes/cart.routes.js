const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cart.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/add', verifyToken, addToCart);

router.get('/', verifyToken, getCart);

router.delete('/:productId', verifyToken, removeFromCart);

module.exports = router;