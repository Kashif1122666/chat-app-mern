import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

// Sign up a new user 
export const signup = async (req, res) => {
    console.log("Signup route hit:", req.body); // <-- ADD THIS
    const { email, fullName, password, bio } = req.body;
    try {
        if (!email || !fullName || !password || !bio) {
            return res.json({success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        await newUser.save(); // ✅ inserts into DB
        console.log("User saved:", newUser); // <-- confirm insert

        const token = generateToken(newUser._id);
        res.json({ success:true, userData:newUser, token, message: "Account created successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// controller to login a user 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({email});
        const isPasswordCorrect = await bcrypt.compare(password,userData.password);
        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials" });
        }
        const token = generateToken(userData._id);
        res.json({success:true,userData,token, message: "Login successful" });
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message });
    }
}

// controller to check if user is authenticated

export const checkAuth = (req, res) => {
        res.json({ success: true, user: req.user }); 
}

// controller to update user profile details 
export const updateProfile = async (req, res) => {
     try {
        const { profilePic, bio , fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;
        if(!profilePic){
          updatedUser =    await User.findByIdAndUpdate(userId,{
                bio,
                fullName,
             },{
                new: true
             });
        }else{
            const upload = await  cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {
                profilePic: upload.secure_url,
                bio,
                fullName
            }, {
                new: true
            });
        }
        res.json({ success: true, user: updatedUser});
     } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
     }
}
