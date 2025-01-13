const { Cart,Product } = require('../models');
// console.log(Product);
// console.log(Cart);


// Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product is already in the cart
    const existingCartItem = await Cart.findOne({ where: { userId, productId } });
    if (existingCartItem) {
      // Update the quantity if the product is already in the cart
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json({ message: 'Cart updated', cartItem: existingCartItem });
    }

    // Add a new product to the cart
    const cartItem = await Cart.create({ userId, productId, quantity });
    res.status(201).json({ message: 'Product added to cart', cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the cart for a user
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product, attributes: ['name', 'salesPrice', 'mrp'] }],
    });

    res.status(200).json({ cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cartItem = await Cart.findOne({ where: { userId, productId } });
    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    await cartItem.destroy();
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
