const mongoose = require("mongoose")
const z=require("zod")
const passwordSchema=z.string().min(6)
const bcrypt =require("bcrypt")
const jwt=require("jsonwebtoken")


const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxLength:20,
        
    },
    lastName:{
        type:String, 
        default:null
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,  
       
    },
    password:{
        type:String,
        required:true,
        validate(value){
          const result=passwordSchema.safeParse(value)
          if(!result.success){
            throw new Error(result.error.message)
          }
        }  
    },
    age:{
        type:Number,
        default:null
    },
    profilePhoto:{
        type:String,
        default:null
        
    },
    bio:{
        type:String,
        default:null
    },
    gender:{
        type:String,
        default:null
        
    },
},{
    timestamps:true
})


userSchema.methods.verifyPassword=async function(passwordByUser){
      const user = this;
      const hashedPasswordFromDB=user.password;
      const validPassword=await bcrypt.compare(passwordByUser,hashedPasswordFromDB)
      return validPassword
}

userSchema.methods.getJWT=async function(){
    const user=this;
    const userId=user?._id.toString();
    // console.log("dfbjhuwsdgfjywsgf",userId)
    const token= jwt.sign({_id:userId},"secret");
    // console.log("token",token)
    return token
}

const User=mongoose.model("User",userSchema)

module.exports=User