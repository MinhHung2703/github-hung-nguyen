const express = require("express");
const { registerController, loginController, testController } = require("../controllers/authController.js");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware.js");
//route object
const router = express.Router()

// routing
// Register || METHOD POST
router.post("/register", registerController);

//LOGIN ||POST
router.post("/login", loginController)


//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

module.exports = router