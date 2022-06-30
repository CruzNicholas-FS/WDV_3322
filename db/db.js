const mongoose=require("mongoose");
const User = require("../api/models/user");

const findUser = async(object) =>{
return await User.find(object);
}

const saveUser = async(newUser) =>{
return newUser.save()
}

module.exports={findUser, saveUser}