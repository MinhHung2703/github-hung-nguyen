const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB Database`.bgMagenta.white)
    } catch (error) {
        console.log(`Error in Mongodb ${error}`.bgRed.white)
    }
}
module.exports = connectDB;