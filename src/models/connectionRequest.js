//create a connection request schema
const mongoose = require("mongoose")


const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId
    },
    status:{
        type:String,
        enum:{
            values:['ignored','accepted','interested','rejected'],
            message:`{VALUE} is not supported`
        }
    }
},{timestamps:true})

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("can not send request to yourself");

    }
    next()  //very important to call next here
})

const ConnectionRequest=new mongoose.model("connectionRequest",connectionRequestSchema);

module.exports=ConnectionRequest