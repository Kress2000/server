require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded());
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const ACCESS_TOKEN_SECRET = "secrete";
// Load User model
const { user } = require("../models/users");
const User = user;
const jwt = require("jsonwebtoken");
app.use(bodyParser.json());

// Register
module.exports.signup_post = async (req, res) => {
  const { name, email, password, confirmPass } = req.body;
  let errors = [];
  if (!name || !email || !password || !confirmPass) {
    errors.push({ msg1empty: "Please enter all fields" });
  }
  if (password != confirmPass) {
    errors.push({ msgNotMatch: "Passwords do not match" });
  }
  if (password && password.length < 6) {
    errors.push({ msgShort: "Password must be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.status(500).json({error: errors});
    // return res.render("signup", {
    //   errors,
    //   name,
    //   email,
    //   password,
    //   confirmPass,
    // });
  } else {
    const existinguser = await User.findOne({ email: email });
    if (existinguser) {
      errors.push({ msgExists: "Email already exists" });
      // res.render("signup", {
      //   errors,
      //   name,
      //   email,
      //   password,
      //   confirmPass,
      // });
      res.status(400).json({ message: "User already exists" });
      return;
    } else {
      try {
        const harshedpassword = await bcrypt.hash(password, 10);
        const newUser = await user.create({
                                    name: name,
                                    password: harshedpassword,
                                    email: email
                                })
        const token = await jwt.sign(
          { email: newUser.email, id: newUser._id },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "100h" }
        );
        res
          .status(201)
          .json({ message: "Account created", user: newUser, token: token });

        // return res.redirect("/login");
      } catch (err) {
        console.log(err);
        // res.status(400).send("Error! User not created!");
      }
    }
  }
};
// Login
module.exports.login_post = async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    const matchPassords = await bcrypt.compare(password, existingUser.password);
    if (matchPassords) {
      req.body.email = existingUser.email;
      if(email.toLowerCase() === 'erickykress@gmail.com'){
        const token = await jwt.sign(
          { email: existingUser.email, id: existingUser._id },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "10h" }
        );
        res
          .status(200)
          .json({
            message: "Welcome Admin!",
            user: existingUser,
            token: token,
          });
      }else{
        const token = await jwt.sign(
          { email: existingUser.email, id: existingUser._id },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        res
          .status(200)
          .json({
            message: `Welcome ${existingUser.name}`,
            user: existingUser,
            token: token,
          });
      }
      // return res.render("blogs");/
    } else {
      res.status(400).json({ message: "Incorect password!" });
      return;
    }
  } else {
    res.status(404).send({ message: "Error! Not logged in" });
    // res.redirect("/signup");
  }
};
module.exports.logout_get =  (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).json({message: 'Unable to log out'})
      } else {
        res.status(200).json({message: 'Logout successful'})
      }
    });
  } else {
    res.end()
  }
}
