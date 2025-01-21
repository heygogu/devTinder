//this middleware will verify token for all 
const jwt = require("jsonwebtoken")
const User=require("../models/user")
const isValidRequestToken=async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
           return res.status(401).json({
                message:"Unauthorized"
            })
        }
        //verify the token
        const decodedMessage=jwt.verify(token,"secret")
        if (!decodedMessage?._id) {
          return res.status(400).json({
                message:"Invalid user"
            })
        }

        const userExists=await User.findById(decodedMessage?._id)
        if(!userExists){
            return res.status(400).send("User does not exist")
        }

        //set the _id in the request object
        
        req._id=decodedMessage?._id;
        next()
    } catch (error) {
        throw new Error("Something went wrong")
    }
}

module.exports=isValidRequestToken;