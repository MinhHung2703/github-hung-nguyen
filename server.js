const epxpress = require("express");
const colors = require("colors")
const dotenv = require('dotenv')
const morgan = require("morgan");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoute.js")
const categoryRoutes = require("./routes/categoryRoute.js")
const productRoutes = require("./routes/productRoute.js")
const cors = require('cors')
//configure dotenv
dotenv.config();

//DB config
connectDB();

//rest object
const app = epxpress();

//middlewares
app.use(epxpress.json())
app.use(morgan("dev"))
app.use(cors())

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)

//rest api
app.get("/", (req, res, next) => {
    res.send("<h1>Welcome to ecommerce app</h1>");
})


// Run listener
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.DEV_MODE} mode on http://localhost:${PORT}`.bgCyan.white);
})