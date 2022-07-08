const express = require("express");
const router = express.Router();
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const {findUser, saveUser}=require("../../db/db");
const User = require("../models/user");

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
                        streetAddress:req.body.streetAddress,
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
                        user:newUser
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
            bcrypt.compare(req.body.password, req.body.hash, (err, result)=>{
                if (err) return res.status(501).json({error:err.message})
                if (result) {
                    res.status(200).json({
                        message:"Login successful",
                        result:result,
                        firstName:response[0].firstName,
                        lastName:response[0].lastName
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

router.get("/profile", (req, res)=>{
    findUser({email:req.body.email})
    .then(result=>{
        if (result.length>0) {
            return res.status(200).json({
                message:"Profile found",
                metadata:{
                    method:req.method,
                    path:req.path,
                    firstName:result[0].firstName,
                    lastName:result[0].lastName,
                    email:result[0].email
                }
            })
        } else{
            return res.status(406).json({
                message:"Profile not found, try again",
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

module.exports=router;