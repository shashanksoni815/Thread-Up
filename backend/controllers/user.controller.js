import Profile from "../models/Profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import crypto from "crypto"
import PDFDocument from "pdfkit";
import ConnectionRequest from "../models/connections.models.js";
// import bcrypt from "bcrypt";

const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString('hex') + '.pdf'
  const stream = fs.createWriteStream('uploads/' + outputPath)

  doc.pipe(stream);

  doc.image("uploads/" + userData.userId.profilePicture, {width: 100, align: "center"});
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.userName}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);
 
  doc.fontSize(14).text("Padt Work: ")
  userData.pastwork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  })

  doc.end();

  return outputPath;

}

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

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({userId: user_id})
    .populate('userId', 'name userName email profilePicture')

    let outputPath = await convertUserDataToPDF(userProfile);

    return res.json({"message" : outputPath})

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const sendConnectRequest = async (req, res) => {
  const {token, connectionId} = req.body;

  try {

    const user = await User.findOne({token: token})

    if(!user) {
      return res.status(404).json({message: "User not found"})
    }
    
    const connectionUser = await User.findOne({_id: connectionId});
    
    if(!connectionUser) {
      return res.status(404).json({message: "Connection User not found"})
    }

    const existingRequest = await ConnectionRequest.findOne(
      {
        userId: user._id,
        connectionId: connectionUser._id
      }
    )

    if(existingRequest) {
      return res.status(400).json({message: "Existing request send"})
    }

    const request = new ConnectionRequest({
      userId : user._id,
      connectionId: connectionUser._id
    })

    await request.save();

    return res.json({message: "Request Sent"});
    
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}