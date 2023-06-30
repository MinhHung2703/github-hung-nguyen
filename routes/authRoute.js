const express = require("express");
const {
    registerController,
    loginController,
    forgotPasswordController,
    testController,
    updateProfileController,
    getOrderController,
    getAllOrdersController,
    orderStatusController
} = require("../controllers/authController.js");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware.js");
//route object
const router = express.Router()

// routing
// Register || METHOD POST
router.post("/register", registerController);

//LOGIN ||POST
router.post("/login", loginController)

//FORGOT PASSWORD
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

//protected user route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

// update profile
router.put("/profile", requireSignIn, updateProfileController)

// orders
router.get("/orders", requireSignIn, getOrderController)

// all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController)

// order status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController)

module.exports = router