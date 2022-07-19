const express = require("express");
const router = express.Router();
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const {findUser, saveUser}=require("../../db/db");
const User = require("../models/user");
const checkAuth = require("../../auth/checkAuth");

router.post("/signup", (req, res)=>{
    findUser({email:req.body.email})
    .then(result=>{
        if (result.length>0) {
            return res.status(406).json({
                message:"User already registered",
                metadata:{
                    method:req.method,
                    path:req.path,
                    email:result.email
                }
            })
        } else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if (err) {
                    res.status(500).json({message:err.message})
                } else{
                    const newUser = new User({
                        _id:mongoose.Types.ObjectId(),
                        firstName:req.body.firstName,
                        lastName:req.body.lastName,
                        address:req.body.address,
                        city:req.body.city,
                        state:req.body.state,
                        zip:req.body.zip,
                        email:req.body.email,
                        password:hash
                    })
                    saveUser(newUser)
                    .then(result=>{
                    return res.status(200).json({
                    message:"User registered successfully",
                    metadata:{
                        method:req.method,
                        path:req.path,
                        user:{
                        firstName:result.firstName,
                        lastName:result.lastName,
                        address:result.address,
                        city:result.city,
                        state:result.state,
                        zip:result.zip,
                        email:result.email,
                        password:req.body.password
                        }
                    }
                })
            })
                }
            })
        }
    })
    .catch(err=>{
        console.error(err.message);
        res.status(500).json({
            error:{
                message:err.message
            }
        })
    })
});

router.post("/login", (req,res)=>{
    findUser({email:req.body.email})
    .then(response=>{
        if (response.length>0) {
            bcrypt.compare(req.body.password, response[0].password, (err, result)=>{
                if (err) return res.status(501).json({error:err.message})
                if (result) {
                    const token = jwt.sign({email:response[0].email, firstName:response[0].firstName, lastName:response[0].lastName}, process.env.key)
                    res.status(200).json({
                        message:"Secured",
                        token:token,
                        welcome:`Welcome ${response[0].firstName}`
                    })
                } else{
                    res.status(401).json({message:"Password incorrect, try again"})
                }
            })
        } else{
            return res.status(406).json({
                message:"Email is incorrect, try again",
                metadata:{
                    method:req.method,
                    path:req.path,
                    email:req.body.email,
                }
            })
        }
    })
    .catch(err=>{
        console.error(err.message);
        res.status(500).json({
            error:{
                message:err.message
            }
        })
    })
})

router.get("/profile", checkAuth, (req, res, next)=>{
    res.status(200).json({message:req.userData})
})

module.exports=router;