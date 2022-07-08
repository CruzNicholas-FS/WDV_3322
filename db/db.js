const mongoose=require("mongoose");
const User = require("../api/models/user");
require("dotenv").config()

const connect = async() =>{
    console.log("Real Connecting");
    await mongoose.connect(process.env.mongodbURL);
}

const disconnect = async() =>{
    console.log("Real Connecting");
    await mongoose.connection.close();
}

const findUser = async(object) =>{
return await User.find(object);
}

const saveUser = async(newUser) =>{
return newUser.save()
}



module.exports={findUser, saveUser, connect, disconnect}