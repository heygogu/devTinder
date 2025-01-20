//this middleware will verify token for all 
const jwt = require("jsonwebtoken")

const isValidRequestToken=async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            res.status(401).json({
                message:"Unauthorized"
            })
        }
        //verify the token
        const decodedMessage=await jwt.verify(token,"secret")
        if (!decodedMessage?._id) {
            res.status(400).json({
                message:"Invalid user"
            })
        }
        //set the _id in the request object
        
        req._id=decodedMessage?._id;
        next()
    } catch (error) {
        throw new Error("Something went wrong")
    }
}

module.exports=isValidRequestToken;