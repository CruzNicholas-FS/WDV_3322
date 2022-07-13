const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports=(req, res, next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, process.env.key);
        req.userData=decoded;
        next();
    } catch (error){
        res.status(401).json({message:error.message})
    }
}