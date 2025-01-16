// const express = require('express');
// const router = express.Router();
// const { completeOrder, getOrders } = require('../controllers/order.controller');

// // Complete an order
// router.post('/complete', completeOrder);

// // Get all orders for a user
// router.get('/:userId', getOrders);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { completeOrder, updateOrderStatus, getAllOrders, getOrders } = require('../controllers/order.controller');
const { verifyToken, isAdmin, isCustomer } = require('../middlewares/authMiddleware');

// Routes
router.post('/complete', verifyToken, isCustomer, completeOrder);
router.put('/updatestatus', verifyToken, isAdmin, updateOrderStatus);
router.get('/allorders', verifyToken, isAdmin, getAllOrders);
router.get('/myorder', verifyToken, getOrders);


module.exports = router;
