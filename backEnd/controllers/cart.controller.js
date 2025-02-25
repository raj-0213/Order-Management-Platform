const jwt = require('jsonwebtoken'); // Import jwt for decoding the token
const { Product, Cart } = require('../models'); // Assuming you have your models properly set up

exports.addToCart = async (req, res) => {
  try {
    // Decode the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is passed as "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: 'Authorization token is missing' });
    }

    const decoded = jwt.verify(token, "secret"); // Verify and decode the token
    const userId = decoded.userId; // Extract the userId from the token

    const { productId, quantity } = req.body;
    // console.log(req.body);
    // Fetch the product to check its stockQuantity
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the requested quantity exceeds available stock
    if (quantity > product.stockQuantity) {
      return res.status(400).json({ error: `No items are available` });
    }

    // Check if the product is already in the cart
    const existingCartItem = await Cart.findOne({ where: { userId, productId } });
    if (existingCartItem) {
      // If the product is already in the cart, validate the total quantity against stock
      if (existingCartItem.quantity + quantity > product.stockQuantity) {
        return res
          .status(400)
          .json({
            error: `Only ${product.stockQuantity - existingCartItem.quantity} items are available`,
          });
      }

      // Update the quantity of the product in the cart
      existingCartItem.quantity += quantity;
      await existingCartItem.save();

      return res.status(200).json({ message: 'Cart updated', cartItem: existingCartItem });
    }

    // Add a new product to the cart
    const cartItem = await Cart.create({ userId, productId, quantity });

    res.status(201).json({ message: 'Product added to cart', cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get the cart for a user
exports.getCart = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is passed as "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: 'Authorization token is missing' });
    }

    const decoded = jwt.verify(token, "secret"); // Verify and decode the token
    const userId = decoded.userId; // Extract the userId from the token

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product, attributes: ['name', 'salesPrice', 'mrp','images'] }],
    });

    res.status(200).json({ cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cartItem = await Cart.findOne({ where: { productId } });
    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    await cartItem.destroy();
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
