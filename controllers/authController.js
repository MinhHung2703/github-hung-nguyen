const userModel = require("../models/userModel.js")
const { hashPassword, comparedPassword } = require("../helpers/authHelper.js");
const jwt = require("jsonwebtoken")

const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        //validations
        if (!name) {
            return res.send({ error: "Name is required" })
        }
        if (!email) {
            return res.send({ error: " Email is required" })
        }
        if (!password) {
            return res.send({ error: " Password is required" })
        }
        if (!phone) {
            return res.send({ error: " Phone is required" })
        }
        if (!address) {
            return res.send({ error: " Address is required" })
        }

        //check user
        const existingUser = await userModel.findOne({ email })
        // existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please Login",
            })
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({ name, email, phone, address, password: hashedPassword }).save();
        res.status(201).send({
            success: true,
            message: 'User Register Successfully',
            user,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registeration',
            error
        })
    }
}

//POST LOGIN
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }
        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }
        const match = await comparedPassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }

        //token
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        })
    }
}

//test
const testController = async (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};

module.exports = { registerController, loginController, testController }