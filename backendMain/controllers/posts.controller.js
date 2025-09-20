import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";

import bcrypt from 'bcrypt';
import Post from "../models/post.model.js";

export const activeCheck = async (req, res) => {
    return res.status(200).json({message: "RUNNING"})
}

export const createPost = async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({token: token});

        if(!user) return res.status(404).json({ message: "User not found"});

        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split('/')[1] : "",
        })

        await post.save();

        return res.status(200).json({message: "Post Created"})


    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};