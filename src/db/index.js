import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


// 2nd appraoch to connect with mongodb(recommended)
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`) // homework: console log connectionInstance
    } catch (error) {
        console.error("MONGODB connection error ", error)
        process.exit(1)
    }
}

export default connectDB