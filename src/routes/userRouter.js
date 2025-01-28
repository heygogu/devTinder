const express=require("express");
const isValidRequestToken = require("../middlewares/authMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter=express.Router();


userRouter.get("/feed",isValidRequestToken,async (req,res)=>{

    try {
        const userId=req?._id;
        //all users who are not in connection requests related to me 

        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {fromUserId:userId},{toUserId:userId}
            ]
        }).select("fromUserId toUserId")
        //make them unique
        const hiddenUsers=new Set();
        connectionRequests.forEach((req)=>{
            hiddenUsers.add(req.fromUserId.toString())
            hiddenUsers.add(req.toUserId.toString())
        })


        //find users excuding hidden users

        // const users =await User.find({_id:{$nin:Array.from(hiddenUsers)}})
        const users=await User.find({

            $and:[

                {_id:{$nin:Array.from(hiddenUsers)}},
                {_id:{$ne:userId}}
            ]
        }
        ).select("firstName lastName emailId profilePhoto age gender bio")

        return res.status(200).json(users)
    } catch (error) {
        throw new Error(error)
    }
})

userRouter.get("/connections",isValidRequestToken,async (req,res)=>{
    try {
        const userId=req?._id;

        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {toUserId:userId,status:"accepted"},
                {fromUserId:userId,status:"accepted"}
            ]
        }).populate("fromUserId","firstName lastName email").populate("toUserId","firstName lastName email");


        const realRequests=connectionRequests.map((request)=>{
            if(request.fromUserId.equals(userId)){
                return {
                    ...request.toObject(),
                    user:request.toUserId
                }
            }else{
                return {
                    ...request.toObject(),
                    user:request.fromUserId
                }
            }
        })
        res.status(200).send(realRequests);

    } catch (error) {
        
    }
})
userRouter.get("/requests/received",isValidRequestToken,async (req,res)=>{
    console.log("hey")
    try {
        const userId=req?._id;
        const requests=await ConnectionRequest.find({toUserId:userId,status:"interested"}).populate("fromUserId","firstName lastName emailId");
        res.status(200).send(requests);
    } catch (error) {
        res.status(400).send("Something went wrong"+error.message)
    }
})

module.exports=userRouter;