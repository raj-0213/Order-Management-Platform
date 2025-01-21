const express = require('express');
const router = express.Router();
const { completeOrder, updateOrderStatus, getAllOrders, getOrders } = require('../controllers/order.controller');
const { verifyToken, isAdmin, isCustomer } = require('../middlewares/authMiddleware');

// Routes
router.post('/complete', verifyToken, completeOrder);
router.put('/updatestatus', verifyToken, isAdmin, updateOrderStatus);
router.get('/allorders', verifyToken, isAdmin, getAllOrders);
router.get('/myorder', getOrders);


module.exports = router;
