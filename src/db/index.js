import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


// 2nd appraoch to connect with mongodb(recommended)
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`) // homework: console log connectionInstance
    } catch (error) {
        console.error("MONGODB connection error:", error.message)
        console.error("Please ensure MONGODB_URI is set in your .env file with format: mongodb://localhost:27017 or mongodb+srv://...")
        process.exit(1)
    }
}

export default connectDB