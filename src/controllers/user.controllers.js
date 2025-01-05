import User from "../modules/user.modules.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import jwt from 'jsonwebtoken'

import bcrypt from "bcrypt";
import nodemailer from "nodemailer" 
// nodemailer

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'terry.rosenbaum93@ethereal.email',
        pass: 'FM8TDKVEjg8HrRfkg3'
    }
});

   // Configuration
   cloudinary.config({ 
    cloud_name:process.env. CLOUD_CLOUD_NAME,
    api_key:process.env. CLOUD_API_KEY ,
    api_secret:process.env.CLOUD_API_SECRET 
});
    
    // Upload an image


    const uploadImageToCloudinary=async(localpath)=>{
        try {
            
            const uploadResult = await cloudinary.uploader
            .upload(
                localpath, {
                    resource_type: 'auto',
                }
            )
           fs.unlinkSync(localpath)
           return  uploadResult.url
        } catch (error) {
            fs.unlinkSync(localpath)
            return(null)
        }
      }




const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_TOKEN_SECRET, { expiresIn: '6h' });
}
const generateRefreshToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_TOKEN_SECRET, { expiresIn: '7d' });
}
const registerUser = async (req, res) => {
    const { email, password ,name,uploadImageToCloudinary} = req.body;
    if (!email) return res.status(400).json({ message: "email required" });
    if (!password) return res.status(400).json({ message: "password required" });
    if (!req.file) return res.status(400).json({message:"no image file upload"})
        const uploadResult=await uploadImageToCloudinary(req.file.path) 
    const user = await User.findOne({ email: email });
    if (user) return res.status(401).json({ message: "user already exist" });
    const createUser = await User.create({
      email,
      password,
      name,
      url:uploadResult
    });
    res.json({ message: "user registered successfully", data: createUser });
  };
// login user
const longinUser = async (req, res) => {
    const { email, password } = req.body
    if (!email) return res.status(400).json({ message: "email is required" })
    if (!password) return res.status(400).json({ message: "password is required" })
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'not found' })
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(404).json({ message: "is not valid password" })

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user);
    res.cookie("refreshToken", refreshToken, { http: true, secure: false })
    res.json({
        message: "user login successfully",
        accessToken,
        refreshToken,
        data: user,
    })
}

// logout user

const logoutUser = async (req, res) => {
    res.clearCookie("refreshToken")
    res.json({ message: "user logout successfully" })

}

// refreshToken
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!refreshToken) return res.status(401).json({ message: "Token not found" })
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_TOKEN_SECRET)
    const user = await User.findOne({ email: decodedToken.email })
    if (!user) return res.stauts(404).json({ message: "user not found" })
    const generateToken = generateAccessToken(user)
    res.json({ message: "generated Token", accesstoken: generateToken })
    res.json({ decodedToken })
}

// middleware
const authenticatonUser = (req, res, next) => {
    const token = req.header["authorizaton"]
    if (!token) return res.stauts(404).json({ message: "not found" })
    jwt.verify(token, process.env.ACCESS_JWT_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({
            message: "invalid "
        })
        req.user = user;
        next()

    })
}


  
   const sendTestemail= async (req,res)=> {
    // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: "anusraza268@gmail.com",                // list of receivers
        subject: "Hello ✔",                                    // Subject line
        text: "Hello world?",                                  // plain text body
        html: "<b>Hello world?</b>",                          // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent", messageId: info.messageId });
} catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ message: "Failed to send email" });
}
};
        
     
    

export { registerUser, longinUser, logoutUser, refreshToken, authenticatonUser,sendTestemail }