import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoute from "./routes/posts.routes.js"

dotenv.config({
    path: "../.env"
});

const app = express();

app.use(cors());
app.use(postRoute);
app.use(express.json());

const start = async () => {

    const connectDB = await mongoose.connect(`${process.env.MONGODB_URI}`)

    app.listen(8080, () => {
        console.log("Server is running on port")
    })

}

start();