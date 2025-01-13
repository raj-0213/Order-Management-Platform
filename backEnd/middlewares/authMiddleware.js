require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to verify the JWT
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // console.log("Decoded token:", decoded); 
    req.userId = decoded.userId;
    req.role = decoded.role;
    // console.log(req.role);
    next();
  });
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
  if (req.role !== 'customer') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
