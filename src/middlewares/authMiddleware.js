


const validator=require("validator")
const z=require("zod");
function signUpMiddleware(req,res,next){

    try{
        const {email,password,firstName}=req.body;

    
        if(!firstName){
            throw new Error("No first name")
            
        }
        else if(!validator.isEmail(email)){
            throw new Error("Invalid Email")
        }
        else if(!validator.isStrongPassword(password)){
            throw new Error("Invalid Password")
        }else{
    
            req.email=email,
            req.password=password,
            req.firstName=firstName
            next();
        }
        
    }
    catch(error){
        res.status(400).send("ERROR: " + error.message);
    }
   
}

module.exports = signUpMiddleware;