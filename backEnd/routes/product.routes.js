const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {verifyToken,isAdmin} = require("../middlewares/authMiddleware");
const {validateRequest} = require("../middlewares/validateRequest");
const { validateProduct } = require("../validators/productvalidation");


const { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
} = require("../controllers/product.controller");

router.post("/create", verifyToken, isAdmin , upload.array("images", 10), validateProduct, createProduct); 

router.get("/", getAllProducts);

// router.get("/category/:categoryId", verifyToken, getProductByCategory);

router.get("/:id", verifyToken, isAdmin, getProductById);

router.put("/:id", verifyToken,isAdmin, upload.array("images"),updateProduct);

router.delete("/:id",verifyToken, isAdmin, deleteProduct);


module.exports = router;
