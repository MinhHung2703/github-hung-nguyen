const categoryModel = require("../models/categoryModel.js");
const slugify = require("slugify");

const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({
                success: false,
                message: " Name is required",
            })
        }
        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category Already Exists"
            })
        }
        const category = await new categoryModel({ name, slug: slugify(name), }).save()
        res.status(201).send({
            success: true,
            message: "New Category Created",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error",
            error
        });
    }
}

const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true }
        );
        res.status(200).send({
            success: true,
            messsage: "Category Updated Successfully",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating category",
        });
    }
};
module.exports = { createCategoryController, updateCategoryController }