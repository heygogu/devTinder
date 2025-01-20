const express = require ("express");
const profileRouter=express.Router();
const isValidRequestToken=require("../middlewares/authMiddleware")
const User = require("../models/user")

profileRouter.get("/view",isValidRequestToken,async (req,res)=>{
      try{

        const _id= req?._id;

        //check for user in database
        const user=await User.findById(
            _id
        )
        if(!user){
            res.status(400).json({
                message:"Invalid user"
            })
        }

        const userObject = {
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            age: user.age,
            profilePhoto: user.profilePhoto,
            bio: user.bio
        }
        res.status(200).json(userObject)
      }catch(error){
        throw new Error(error);
      }
})


profileRouter.patch("/edit",isValidRequestToken,async (req,res)=>{
    try{
        const _id=req?._id;
        const {firstName,lastName,age,profilePhoto,bio}=req.body;

        //check for user in db
        const user=await User.findById(
            _id
        )
        if(!user){
            res.status(400).json({
                message:"Invalid user"
            })
        }

        //assigning new values and saving the user
        Object.assign(user, {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            age: age || user.age,
            profilePhoto: profilePhoto || user.profilePhoto,
            bio: bio || user.bio
        });

        await user.save();

        res.status(200).json({
            message:"User updated successfully"
        })

    }
    catch(error){
        throw new Error(error)
    }

})

module.exports=profileRouter;