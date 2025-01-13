// authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

exports.isCustomer = (req, res, next) => {
  if (req.role !== 'customer') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
