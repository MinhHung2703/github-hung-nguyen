const express = require("express")
const { isAdmin, requireSignIn } = require("./../middlewares/authMiddleware.js");
const { createCategoryController, updateCategoryController } = require("./../controllers/categoryController.js");

const router = express.Router()

//create category
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

//Update Category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController)
module.exports = router