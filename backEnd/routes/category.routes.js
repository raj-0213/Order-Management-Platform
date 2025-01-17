const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');


// Routes for Category CRUD
router.post('/create', verifyToken,isAdmin,createCategory);
router.get('/', verifyToken,isAdmin,getAllCategories);
router.put('/update/:id', verifyToken,isAdmin,updateCategory);
router.delete('/delete/:id', verifyToken,isAdmin,deleteCategory);

// router.get('/categories/:id', getCategoryById);

module.exports = router;
