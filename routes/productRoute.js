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
    productCountController,
    productListController,
    searchProductController,
    realtedProduceController,
    braintreeTokenController,
    brainTreePaymentController
} = require("../controllers/productController");
const formidable = require("express-formidable");

const router = express.Router();

//routes
router.post(
    "/create-product",
    requireSignIn,
    isAdmin,
    formidable(),
    createProductController
);
//routes
router.put(
    "/update-product/:id",
    requireSignIn,
    isAdmin,
    formidable(),
    updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController)

//product per page
router.get("/product-list/:page", productListController)

// search product
router.get("/search/:keyword", searchProductController)

// similar product
router.get('/related-product/:pid/:cid', realtedProduceController)

//payments route
//token
router.get("/braintree/token", braintreeTokenController)

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController)

module.exports = router;