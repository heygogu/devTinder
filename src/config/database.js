const mongoose = require("mongoose");

const connectDB = async () => {
  
 await mongoose.connect("mongodb+srv://rohit:9eipuX4RjBExUU0z@nodejs.v4w0l.mongodb.net/devTinder")
 console.log("DB Connected")
 
};

module.exports = connectDB;