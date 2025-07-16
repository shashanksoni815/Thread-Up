import Profile from "../models/Profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import crypto from "crypto"
// import bcrypt from "bcrypt";

export const register = async (req, res) => {
    try{
        const {name, email, password, userName} = req.body;

        if(!name || !email || !password || !userName) return res.status(400).json({message: "All Fields are required"})

        const user = await User.findOne({
            email
        });

        if(user) return res.status(400).json({message: "User already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userName
        })

        await newUser.save();

        const profile = new Profile({ userId: newUser._id})

        return res.json({message: "User Created "})

    } catch (error){
        return res.status(500).json({message: error.message})
    }
}

// import Profile from "../models/Profile.model.js";
// import User from "../models/user.model.js";
// import bcrypt from "bcrypt";

// export const register = async (req, res) => {
//   try {
//     const { name, email, password, userName } = req.body;

//     // Validate all fields
//     if (!name || !email || !password || !userName) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Normalize email
//     const normalizedEmail = email.toLowerCase();

//     // Check for existing user
//     const existingUser = await User.findOne({ email: normalizedEmail });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({
//       name,
//       email: normalizedEmail,
//       password: hashedPassword,
//       userName,
//     });

//     await newUser.save();

//     // Create and save user profile
//     const profile = new Profile({ userId: newUser._id });
//     await profile.save();

//     return res.status(201).json({
//       message: "User created successfully",
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         userName: newUser.userName,
//       },
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

export const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    if(!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({
      email
    });

    if(!user) return res.status(400).json({message: "User does not exist"})

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) return res.status(400).json({message: "Invalid Credentials"})

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({_id: user._id}, {token})

    return res.json({token})

  } catch (error) {
    console.log(error);
  }
}

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({token: token});

    if(!user) return res.status(404).json({message: "User not found"})
    
    user.profilePicture = req.file.filrname;
    await user.save();
    return res.json({message: "Profile Picture Uploaded"})
    
  } catch (error) {
    return res.status(500).json({message: error.message})
  }

}

export const updateUserProfile = async (req, res) => {
  try {

    const { token, ...newUserData} = req.body;

    const user = await User.findOne({token: token})

    if(!user) {
      return res.status(404).json({message: "User not found"})
    }

    const {userName, email} = newUserData;

    const existingUser = await User.findOne({$or: [{userName}, {email}]})
    
    if(existingUser) {
      if(existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({message: "User already exists"})
      }
    }

    Object.assign(user, newUserData);

    await user.save();
    return res.json({message: "User Updated"})

  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}

export const getUserAndProfile = async(req, res) => {

  try {
    const {token} = req.body;

    const user = await User.findOne({token: token});

    if(!user) {
      return res.status(404).json({message: "User not found"})
    }

    const userProfile = await Profile.findOne({userId: user._id })
      .populate('userId', 'name email userName profilePicture');

    return res.json(userProfile);
    
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const updateProfileData = async (req, res) => {
  try {
    
    const { token, ...newProfileData} = req.body;

    const userProfile = await User.findOne({token: token});

    if(!userProfile){
      return res.status(404).json({message: "User not found"})
    }

    const profile_to_update = await Profile.findOne({userId: userProfile._id})

    Object.assign(profile_to_update, newProfileData);

    await profile_to_update.save();

    return res.json({message: "profile Updated"})

  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}


