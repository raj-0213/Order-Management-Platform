// userRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getUserProfile,getAllUsers, changeUserRole, editProfile,deleteUser} = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getUserProfile);
router.get('/allusers',verifyToken,isAdmin,getAllUsers);
router.put('/changerole',verifyToken,isAdmin,changeUserRole);
router.put('/updateprofile/:id',verifyToken,editProfile);
router.delete('/deleteuser/:id',verifyToken,isAdmin,deleteUser);

module.exports = router;
