const { Order, OrderDetails, Cart, Product } = require('../models');
const db = require('sequelize');
const sequelize = db.sequelize;
const jwt = require('jsonwebtoken'); // Import jwt for decoding the token


// Complete an order
// exports.completeOrder = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     // Get all items from the user's cart
//     const cartItems = await Cart.findAll({ where: { userId }, include: [Product] });
//     if (cartItems.length === 0) {
//       return res.status(400).json({ error: 'Cart is empty' });
//     }

//     // Calculate the total amount
//     const totalAmount = cartItems.reduce((total, item) => {
//       return total + item.quantity * item.Product.salesPrice;
//     }, 0);

//     // Create a new order
//     const order = await Order.create({ userId, status: 'pending', totalAmount });

//     // Add order details for each cart item
//     const orderDetails = cartItems.map((item) => ({
//       orderId: order.id,
//       productId: item.productId,
//       quantity: item.quantity,
//       price: item.Product.salesPrice,
//     }));
//     await OrderDetails.bulkCreate(orderDetails);

//     // Clear the user's cart
//     await Cart.destroy({ where: { userId } });

//     res.status(201).json({ message: 'Order completed', order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.completeOrder = async (req, res) => {
  try {
    // Decode the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is passed as "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: 'Authorization token is missing' });
    }

    const decoded = jwt.verify(token, "secret"); // Verify and decode the token
    const userId = decoded.userId; // Extract the userId from the token

    // Get all items from the user's cart
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [Product], // Include product details
    });

    // Check if the cart is empty
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty' });
    }

    // Validate stock and calculate total amount
    let totalAmount = 0;
    const insufficientStockProducts = [];

    for (const item of cartItems) {
      const product = item.Product;

      // Check stock availability
      if (item.quantity > product.stockQuantity) {
        insufficientStockProducts.push({
          productId: product.id,
          productName: product.name,
          availableStock: product.stockQuantity,
        });
        continue; // Skip this product
      }

      // Deduct the purchased quantity from the stock
      product.stockQuantity -= item.quantity;
      totalAmount += item.quantity * product.salesPrice;

      // Save the updated product stock to the database
      await product.save();
    }

    // If any product has insufficient stock, return an error
    if (insufficientStockProducts.length > 0) {
      return res.status(400).json({
        error: 'Insufficient stock for some products',
        insufficientStockProducts,
      });
    }

    // Create a new order
    const order = await Order.create({
      userId,
      status: 'pending', // Default status
      totalAmount,
    });

    // Add order details for each item in the cart
    const orderDetails = cartItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.Product.salesPrice,
    }));
    await OrderDetails.bulkCreate(orderDetails);

    // Clear the user's cart
    await Cart.destroy({ where: { userId } });

    res.status(201).json({
      message: 'Order completed successfully',
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    if (!['pending', 'confirmed', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// For Admin Only
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [{ model: OrderDetails, include: Product }] });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders for a user
exports.getOrders = async (req, res) => {
  try {
     // Decode the token from the Authorization header
     const token = req.headers.authorization.split(' ')[1]; // Assuming the token is passed as "Bearer <token>"

     if (!token) {
       return res.status(401).json({ error: 'Authorization token is missing' });
     }
 
     const decoded = jwt.verify(token, "secret"); // Verify and decode the token
     const userId = decoded.userId; // Extract the userId from the token

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderDetails,
          include: [{ model: Product, attributes: ['name', 'salesPrice'] }],
        },
      ],
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
