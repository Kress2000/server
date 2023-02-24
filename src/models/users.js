const mongoose = require('mongoose');
const {isEmail}= require('validator');
const user = mongoose.model("user",
    {
        name:{
            type: String
        },
        id:{
            type: Number
        },
        email:{
            type: String,
            required: [true, 'please enter an Email'],
            unique: true,
            lowercase: true,
            validate: [isEmail, 'Plz enter a valid email']
        },
        password:{
            type: String,
            required: [true, 'Please enter a password!'],
            minength: [5, 'Minimum length must be at least 5 characters'],
        },
        location:{
            type: Object,
        }
    }
)
module.exports = {user};