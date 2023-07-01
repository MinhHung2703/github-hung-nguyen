const slugify = require("slugify");
const productModel = require("../models/productModel.js");
const categoryModel = require("../models/categoryModel.js")
const orderModel = require("../models/orderModel.js")
const fs = require("fs")
const braintree = require("braintree");

//payment gateway

const initilizeGetway = () => {
    try {
        return new braintree.BraintreeGateway({
            environment: braintree.Environment.Sandbox,
            merchantId: process.env.BRAINTREE_MERCHANT_ID,
            publicKey: process.env.BRAINTREE_PUBLIC_KEY,
            privateKey: process.env.BRAINTREE_PRIVATE_KEY,
        });
    } catch { }
}

const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
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
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Photo is required and should be less then 1mb" });
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
            products,
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

const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createAt: -1 })
        res.status(200).send({
            success: true,
            counTotal: products.length,
            message: "All Products",
            products
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error: error.message
        });
    }
}

const getSingleProductController = async (req, res) => {
    try {
        console.log(req.params.slug);
        const product = await productModel
            .findById(req.params.slug)
            .select("-photo")
            .populate("category")
        res.status(200).send({
            success: true,
            message: "single Product Fetched",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting single product",
            error,
        });
    };
}

const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting photo",
            error
        })
    }
}

const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "Product Delete successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while delecting product",
            error
        })
    }
}
const updateProductController = async (req, res) => {
    console.log(req.body);
    try {
        const { name, description, price, category, quantity, shipping } = req.body;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "quantity is Required" });
            case !photo:
                return res.status(500).send({ error: "Photo is Required and should be less then 1mb" });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params._id,
            { ...req.fields, slug: slugify(name) },
            { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(200).send({
            success: true,
            message: "Product Updated Successfully",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in update product"
        })
    }
}

// filters
const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: " Error while Filtering Products",
            error
        });
    }
}

// Count product
const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in product count",

        })
    }
}

// product list base on page
const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createAt: -1 });
        res.status(200).send({
            success: true,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in per page ctrl",
            error
        });
    }
}

// search product
const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        console.log(keyword)
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ],
        })
            .select("-photo")
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Search",
            error
        })
    }
}
//similar products
const realtedProduceController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel
            .find(
                {
                    category: cid,
                    _id: { $ne: pid }
                }
            )
            .select("-photo")
            .limit(3)
            .populate("category")
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while getting related product",
            error
        })
    }
}

//payment gateway api
const braintreeTokenController = async (req, res) => {
    try {
        const gateway = await initilizeGetway();
        gateway.clientToken.generate({}, function (error, response) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const brainTreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => (total += i.price));
        const gateway = await initilizeGetway();
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            },
        },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save();
                    res.json({ ok: true })
                } else {
                    res.status(500).send(error)
                }
            }
        )
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
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
}