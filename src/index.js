const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser")
const app = express();
const authRouter = require("./routes/authRouter")
const profileRouter=require("./routes/profileRouter")

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/auth",authRouter)
app.use("/profile",profileRouter)

app.use((err, req, res, next) => {
    res.status(400).send("Something went wrong" + err.message)
})

connectDB().then(() => {
    app.listen(7777, () => {
        console.log("server started at port 7777")
    })
}).catch((error) => {
    console.log("Could not start the server" + error)
})