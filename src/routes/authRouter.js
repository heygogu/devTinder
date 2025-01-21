const express=require("express");
const authRouter=express.Router()

const User=require("../models/user");
const validateRequestBody=require("../utils/validateRequestBody");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
// const cookieParser=require("cookie-parser");

authRouter.post("/signup", async (req, res) => {
    try {
        validateRequestBody(req)

        const { email, password, firstName } = req.body;
        console.log(email, password, firstName)

        //password encrypted using salt rounds
        const encryptedPassword = await bcrypt.hash(password, 10)


        //created a new instance of user model and saved it to the database
        const user = new User({
            firstName: firstName,
            emailId: email,
            password: encryptedPassword
        });

        await user.save()

        res.status(200).send("User sign up successful");

    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message)
    }


})

authRouter.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const user = await User.findOne({ emailId: email })
        if (!user) throw new Error("user does not exist");

        //using a schema method
        const isPasswordValid = await user.verifyPassword(password)
        if (!isPasswordValid) {
            throw new Error("Incorrect Password");
        }
 
        const token =await user.getJWT()
        console.log(token)

        res.cookie("token", token)

       return res.status(200).send("Log in successful")


    } catch (error) {
       return res.status(400).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})


// authRouter.get("/profile", async (req, res) => {
//     try {
//         const { token } = req.cookies;

//         if (!token) {
//             return res.status(401).json({
//                 message: "No token present",
//             });
//         }

//         const decodedMessage =await jwt.verify(token, "secret");

//         if (!decodedMessage?._id) {
//             throw new Error("Malicious token")
//         }
//         const userId = decodedMessage?._id;

//         //find user by id (mongoose method)
//         const user = await User.findById(userId);

//         if (!user) {
//             throw new Error("User not found");
//         }


//         res.status(200).json(user)
//     } catch (error) {
//         console.error('Profile error:', error);
//         res.status(401).json({
//             message: "Something went wrong",
//             error: error.message
//         })
//     }
// })


authRouter.post("/logout",(req,res)=>{
    res.clearCookie("token")

    //or I can do res.cookie("token",null,{expires:new Date(Date.now())}).send("Logout successful")
    return res.status(200).send("Logged out successfully")
})

module.exports=authRouter;