const express = require("express");
const User = require('./models/user')
const signUpMiddleware = require("./middlewares/authMiddleware")
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken")
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser")
const app = express();


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,

  }));
  

app.use(express.json());
app.use(cookieParser())



app.post("/signup", signUpMiddleware, async (req, res) => {

    try {

        const { email, password, firstName } = req.body;
        console.log(email, password, firstName)

        const encryptedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            firstName: firstName,
            emailId: email,
            password: encryptedPassword
        });

        await user.save()

        console.log("here")

        res.status(200).send("User sign up successful");

    }
    catch (err) {
        res.status(400).send("Something went wrong" + err)
    }


})

app.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const user = await User.findOne({ emailId: email })
        if (!user) throw new Error("user does not exist");

        const isPasswordValid = await user.verifyPassword(password)
        if (!isPasswordValid) {
            throw new Error("Incorrect Password");
        }

        const token = jwt.sign({ _id: user?._id }, "secret")
        res.cookie("token", token)

        res.status(200).send("Log in successful")


    } catch (error) {
        res.status(400).send("Something went wrong " + error)
    }
})

// In your profile route
app.get("/profile", async (req, res) => {
    try {
      console.log('Cookies received:', req.cookies);  
      const {token} = req.cookies;
      
      if (!token) {
        return res.status(401).send("No token provided");
      }
      
      const decodedMessage = jwt.verify(token, "secret");
      console.log('Decoded token:', decodedMessage);  
      const userId = decodedMessage._id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).json(user)
    } catch (error) {
      console.error('Profile error:', error);  
      res.status(401).send(error.message)
    }
  })




app.use((err, req, res,next) => {
    res.status(400).send("Something went wrong" + err)
})

connectDB().then(() => {
    app.listen(7777, () => {
        console.log("server started at port 7777")
    })
}).catch((error) => {
    console.log("Could not start the server" + error)
})