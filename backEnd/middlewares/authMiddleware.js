require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to verify the JWT
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    // Decode the JWT and extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.userId = decoded.userId;

    // Fetch the user's role from the database
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.role = user.role; // Attach role to the request object
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Updated isAdmin Middleware using the database
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.role!=='admin') {
      return res.status(403).json({ error: 'You are not Admin.' });
    }
    next();
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to check if the user is a customer
exports.isCustomer = (req, res, next) => {
  console.log(req.role);
  if (req.role !== 'customer') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
