const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct } = require("../controllers/product.controller");

router.post("/create", upload.array("images", 10), createProduct); 

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.put("/:id", upload.array("images"), updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
