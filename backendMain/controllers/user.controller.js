import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = async (req, res) => {
    try {
        // console.log(req); 
        const {name, email, password, username} = req.body;

        if (!name || !email || !password || !username ) return res.status(400).json({ message: "All fields are required" })

        const user = await User.findOne({
            email
        });

        if(user) return res.status(400).json({ message: "User already exists"})

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
        });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id});

        return res.json({message: "User Created Successfully"})

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({message: "All fields are required"})

        const user = await User.findOne({
            email
        });

        if (!user) return res.status(404).json({message: "User does not exist"})

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"})

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({ _id: user._id}, {token});

        return res.json({token})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const uploadProfilePicture = async(req, res) => {
    const { token } = req.body;

    try {
        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

// export default  {register};