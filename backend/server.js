import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const start = async () => {
    const connectDB = await mongoose.connect("mongodb+srv://shashanksoni815:2a9ghem8XEpalNog@threads.zk61tyk.mongodb.net/?retryWrites=true&w=majority&appName=threads")

    app.listen(9090, () => {
        console.log("Server is running on port 9090")
    })
}

start();