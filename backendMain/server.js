import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoute from "./routes/posts.routes.js"
import userRoutes from "./routes/user.routes.js"

dotenv.config({
    path: "../.env"
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(postRoute);
app.use(userRoutes)

const start = async () => {

    const connectDB = await mongoose.connect(`${process.env.MONGODB_URI}`)

    app.listen(8080, () => {
        console.log("Server is running on port")
    })

}

start();