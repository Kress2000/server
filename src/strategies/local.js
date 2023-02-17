const localStrategy = require('passport-local');
const passport = require('passport');
const {user} = require('../models/users')

passport.use(new localStrategy(async (name, password, done)=>{
    const result =  await  database.promise().query( user.name = name);
    console.log(result)

}))
