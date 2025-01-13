const { Order, OrderDetails, Cart, Product } = require('../models');

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
    const { userId } = req.body;

    // Get all items from the user's cart
    const cartItems = await Cart.findAll({ where: { userId }, include: [Product] });
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate the total amount and update stock
    const totalAmount = cartItems.reduce((total, item) => {
      if (item.quantity > item.Product.stockQuantity) {
        throw new Error(`Insufficient stock for product: ${item.Product.name}`);
      }
      total += item.quantity * item.Product.salesPrice;

      // Deduct the purchased quantity from the stock
      item.Product.stockQuantity -= item.quantity;
      item.Product.save(); // Update the stock in the database
      return total;
    }, 0);

    // Create a new order
    const order = await Order.create({ userId, status: 'pending', totalAmount });

    // Add order details for each cart item
    const orderDetails = cartItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.Product.salesPrice,
    }));
    await OrderDetails.bulkCreate(orderDetails);

    // Clear the user's cart
    await Cart.destroy({ where: { userId } });

    res.status(201).json({ message: 'Order completed', order });
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
    const { userId } = req.params;

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
    res.status(500).json({ error: error });
  }
};
