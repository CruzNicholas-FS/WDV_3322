const express = require("express");
const app = express();
const cors = require("cors");
const router = require("../api/routes/router");
const mongoose=require("mongoose");
const swaggerJsDoc=require("swagger-jsdoc");
const swaggerUI=require("swagger-ui-express");
const options=require("../config/swaggerOptions.json");
require("dotenv").config()

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.get("/", (req, res)=>{
    res.status(200).json({
        message: "Server is up",
        metadata:{
            method:req.method,
            hostname:req.hostname
        }
    })
})

app.use("/users", router);

console.log(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(options));

//add middleware for error handling
app.use((req, res, next) => {
    const error = new Error("not found");
    error.status = 404;
    next(error);
});
  //middleware to send error nicely
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      error: {
        message: error.message,
        status: error.status,
        method: req.method,
      },
    });
});

mongoose.connect(process.env.mongodbURL, err =>{
    if (err) {
        console.error("Error: ", err.message)
    } else {
        console.log("MongoDB connection successful")
    }
})

module.exports=app;