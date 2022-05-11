
const mongoose = require("mongoose");
const userSchema = require("../model/userSchema");
const users = require('../model/userSchema')
const bcrypt = require('bcrypt');
const { hash } = require("bcrypt");
const saltRounds = 10;
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const res = require("express/lib/response");
const smsClient = require('textmagic-rest-client')


var accountSid = process.env.TWILIO_ACCOUNT_SID; 
var authToken = process.env.TWILIO_AUTH_TOKEN; 


console.log("checking auth token", authToken)
console.log("checking accountSid", accountSid)


module.exports = {
  signup: signup,
  findUser:findUser,
  updateUserStatus:updateUserStatus,
  updateUser:updateUser,
  // sendMsg:sendMsg
  allUsers:allUsers,
  login:login
  

};

// ...

// Create mail transporter.
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'scanvirusteam@gmail.com',
    pass: 'Deep@12345'
  }
});




// scheduling and sending the email 
 cron.schedule('0 0 * * *', async function() {
  console.log('---------------------');
  console.log('Running Cron Job');
  

  let messageOptions = {
    from: 'donotreply@yopmail.com',
    to: 'iamcheckingmail@yopmail.com',
    subject: 'Omfo',
    text: 'Dhurai Kat rhi hai  '
  };

  transporter.sendMail(messageOptions, function(error, info) {
    if (error) {
      throw error;
    } else {
      console.log("email sent to ", messageOptions.to)
    }
  });


  
});

function signup(req, res) {
    async function signup() {
      try {
         console.log(req.body)
         let checkEmail = await users.findOne({email:req.body.email})
         if(checkEmail){
           res.status(400).json({message:"Already exist"})
           console.log("already exist", checkEmail)
         }else{
          const userData = new userSchema(req.body)

          await userData.save().then((err, result)=>{
            if(err){console.log("error", err)}else{res.status(200).json({message :"Added", data: result})}
            // mailer after the registration
            let newName = req.body.name
            let messageOptions = {
              from: 'donotreply@yopmail.com',
              to: req.body.email,
              subject: 'Registration Notification',
              text: 'Hi,'+ newName +  ' Thanks for the registration'
            };
          
            transporter.sendMail(messageOptions, function(error, info) {
              if (error) {
                throw error;
              } else {
                console.log("email has sent to", newName)
                res.status(200).json({message:"Mail Sent"})
              }
            });
          })

         }
         
       
      } catch (error) {
        console.log("error",error)
      }
    }
    signup().then(function () { });
  }

  async function findUser(req, res) {
    console.log("req.body == ", req.body);
    try {
      await users.find({_id:req.body._id}, (err, result)=>{
        if(!err)
        {
          res.status(200).json({message:"User Fetched", data:result})
        }else
        {
          res.status(500).json({message:"User not available", data: err})
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async function updateUserStatus(req, res) {
    console.log("req.body == ", req.body);
    try {
      await users.findOneAndUpdate({_id:req.body._id},{$set: {isDeleted: true}}, {new:true}, (err, result)=>{
        if(err){
          res.status(400).json({message:"Something happened"})
        }else{
         
          res.status(200).json({message:"User Deleted Successfully"})
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async function updateUser(req, res){
    try{
     let userId = await users.find({_id:req.body._id})
     console.log("userId", userId)
     
     let dataToPass = {
      name:req.body.name, 
      email:req.body.email, 
      designation:req.body.designation,
      phoneNumber: req.body.phoneNumber,
      isDeleted: req.body.isDeleted,
      password : req.body.password
     }

     await users.findOneAndReplace({_id:userId},(dataToPass) ,{new:true}, (err, result)=>{
       if(err){
         res.status(400).json({message:"Something went wrong"})
       }else{
         res.status(200).json({message:"User Updated", result})
         console.log("updated user", result)
       }
     })
    }
    catch (error) {
      console.log(error)
    }

  }

  // async function sendMsg(req, res){
  //   const numberr = req.body.phoneNumber;
  //   console.log("numberr", numberr)
    
  //   let newNumber = '+91'+numberr
  //   console.log("numberr", newNumber)

  //   const client = require('twilio')(accountSid, authToken);
  //   client.messages
  //   .create({
  //      body: req.body.message,
  //      from: '+19706968480',
  //      to: newNumber
  //    })
     
  //   .then(message => res.json(message))
  //   .catch(message => res.json(message))
  //   .done();

  

  // }
  async function allUsers(req, res){
  let newData = await userSchema.find({})
  if(newData.length > 0){
    
      

   
  res.status(200).json({message:"Data Fetched", data: newData})
  }else{
    console.log("something wrong")

  }
  }

 async function login(req, res){
  let userEmail  = await userSchema.findOne({email:req.body.email})
  if(userEmail){
    console.log("this is the user", userEmail)
  }
 }

 

