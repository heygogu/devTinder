const mongoose = require("mongoose")
const z=require("zod")
//now I need to create a schema
const passwordSchema=z.string().min(6)
const bcrypt =require("bcrypt")


const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxLength:20

    },
    lastName:{
        type:String,
        
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
            throw new Error("Invalid Password")
          }
        }  
    },
    age:{
        type:Number,
    }
},{
    timestamps:true
})


userSchema.methods.verifyPassword=async function(passwordByUser){

    const user = this;
      const hashedPasswordFromDB=user.password;

      const validPassword=await bcrypt.compare(passwordByUser,hashedPasswordFromDB)
      return validPassword
    
}
const User=mongoose.model("User",userSchema)

module.exports=User