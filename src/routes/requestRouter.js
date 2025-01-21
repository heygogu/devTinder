const ConnectionRequest = require("../models/connectionRequest")
const express = require("express");

const requestRouter = express.Router();

const isValidRequestToken = require("../middlewares/authMiddleware")
const User=require("../models/user")


requestRouter.post("/send/:status/:userId", isValidRequestToken, async (req, res) => {

    //first validate the request

    try {
        const fromUserId = req?._id;
        const toUserId = req.params.userId;
        const status = req.params.status.trim();

        //check if the toUserId exists in our db or not

        const toUserExists=await User.findById(toUserId);
        if(!toUserExists){
            return res.status(401).json({
                message:"user does not exist"
            })
        }

        //check if status is different from ignored and interested
        const allowedStatuses = ["interested", "ignored"]

        if (!allowedStatuses.includes(status)) {
            return res.status(401).json({
                message: "Invalid status detected"
            })
        }

        //check if request exist already or not in vice versa 
        const requestExists = await ConnectionRequest.findOne(
            {
                $or: [
                    { fromUserId, toUserId }, {fromuserId: toUserId, toUserId: fromUserId}
                ]
            }
        )

        if (requestExists) {
            return res.status(401).json({
                message: "Request already exists"
            })
        }
        

        //check if the user is sending the request to themselves
        //let us check this using the pre method on schema level -> check out the connectionRequestSchema

        //now we need to save the user 
        //1. create the instance
        const connectionRequest=new ConnectionRequest({
            fromUserId,toUserId,status
        })


        //saving the connection request
        const data=await connectionRequest.save();

        return res.json({
            message:status+" Request Handled",
            data
        })



    } catch (error) {
       res.status(400).json({
        message:error.message
       })
    }
})

module.exports = requestRouter