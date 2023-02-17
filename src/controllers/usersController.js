require('dotenv').config();
const express = require('express');
const app = express();
const {user} = require('../models/users');
app.use(express.json());
const bodyParser = require('body-parser');
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(express.json());

// getting all users api
module.exports.users_get = (req, res)=>{
    user.find({}, (err, data)=>{
        if(!err){
            res.send(data);
        }else{
            console.log(err)
        }
    })
    // res.render('/login')
}
//get single user basing on his id
module.exports.users_getOne= (req, res)=>{
    user.findById(req.params.id, (err, data)=>{
        !err?res.send(data):console.log(err);
    })
}
//Update single user basing on his id
module.exports.users_update= (req, res)=>{
    const updatedUser={
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        location: req.body.location
    }
    user.findByIdAndUpdate(req.params.id, {$set: updatedUser}, {new: true}, (err, data)=>{
        !err? res.status(202).json({
            code: 202, 
            message: "Changes accepted", 
            updateUser: data
        }):console.log(err);
    })
}
// /delete  single user basing on his id
module.exports.users_delete= (req, res)=>{
    user.findByIdAndRemove(req.params.id, (err, data)=>{
        if(!err){
            res.status(202).json({
                code: 202, 
                message: "User deleted successfully", 
                removedUser: data
            })
        }else{
            console.log(err);
        }
    })
}
