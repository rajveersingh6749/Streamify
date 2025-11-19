import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

let isConnected = false; // <-- important cache

const connectDB = async () => {
  if (isConnected) {
    // If already connected, skip reconnection
    return;
  }

  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    isConnected = connection.connections[0].readyState === 1;

    console.log("MongoDB connected:", connection.connection.host);
  } catch (error) {
    console.error("MONGODB connection error: ", error);
    throw new Error("Error connecting to MongoDB");
  }
};

export default connectDB;
