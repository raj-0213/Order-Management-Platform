const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {verifyToken,isAdmin} = require("../middlewares/authMiddleware");
const {validateRequest} = require("../middlewares/validateRequest");
const { productSchema } = require("../validations/product.validation");

const { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct } = require("../controllers/product.controller");

router.post("/create", verifyToken, isAdmin , upload.array("images", 10), createProduct); 

router.get("/", verifyToken, isAdmin, getAllProducts);

router.get("/:id", verifyToken, isAdmin, getProductById);

router.put("/:id", verifyToken,isAdmin, upload.array("images"),updateProduct);

router.delete("/:id",verifyToken, isAdmin, deleteProduct);


module.exports = router;
