import serverless from "serverless-http";
import dotenv from "dotenv";
import connectDB from "../src/db/index.js";
import app from "../src/app.js";

dotenv.config({ path: "./.env" });

// Connect to MongoDB ONCE during cold start
await connectDB();

export const handler = serverless(app);
