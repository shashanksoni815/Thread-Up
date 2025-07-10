import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js"
import userRoutes from "./routes/user.routes.js"
// import env from "../.env";
// import userR

dotenv.config({
    path: "../.env"
});

// connectDB()

const app = express();

app.use(cors());

app.use(express.json());
app.use(postRoutes);
app.use(userRoutes)

const start = async () => {
    // const connectDB = await mongoose.connect(`${process.env.MONGODB_URI}`)

    // app.listen(9090, () => {
    //     console.log("Server is running on port 9090")
    // })
    try {
        console.log("🌐 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        app.listen(9090, () => {
            console.log("🚀 Server is running on port 9090");
        });
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
}

start();