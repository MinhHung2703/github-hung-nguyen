const { default: slugify } = require("slugify");
const productModel = require("../models/productModel");
const fs = require('fs')
const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quality, shipping } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" });
            case !description:
                return res.status(500).send({ error: "Description is required" });
            case !price:
                return res.status(500).send({ error: "Price is required" });
            case !category:
                return res.status(500).send({ error: "Category is required" });
            case !quality:
                return res.status(500).send({ error: "Quality is required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "{Photo is required and should be less then 1mb" });
        }
        const products = await productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product"
        })
    }
}

module.exports = { createProductController }