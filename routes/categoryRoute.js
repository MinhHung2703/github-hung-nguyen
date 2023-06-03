const express = require("express")
const { isAdmin, requireSignIn } = require("./../middlewares/authMiddleware.js");
const { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } = require("./../controllers/categoryController.js");

const router = express.Router()

// Create category
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

// Update Category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);

// Get All Category
router.get('/get-category', categoryController)

// Single Category
router.get("/single-category/:slug", singleCategoryController)

// Delect category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController)
module.exports = router