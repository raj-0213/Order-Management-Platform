// userRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getUserProfile } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

// Routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
