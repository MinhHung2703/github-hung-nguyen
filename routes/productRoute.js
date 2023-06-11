const express = require("express")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
    createProductController,
    updateProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    productFiltersController,
    productCountController
} = require("../controllers/productController");
const formidable = require("express-formidable");
const router = express.Router()

// Route
router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController)

//Update Product
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController)

// get products
router.get("/get-product", getProductController)

// single products
router.get("/get-product/:slug", getSingleProductController)

// get photo
router.get("/product-photo/:pid", productPhotoController)

//delete product
router.delete("/delete-product/:pid", deleteProductController)

// filter product
router.get("/product-filters", productFiltersController);

//product Count
// router.get("/product-count", productCountController)
module.exports = router;