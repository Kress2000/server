"use strict";
require("dotenv").config();
const express = require("express");
const router = express.Router();
const actionController = require("../controllers/actionController");
const userController = require("../controllers/usersController");
const blogsController = require("../controllers/blogsController");
const app = express();
const { blog } = require("../models/blogs");
app.use(express.json());
const bodyParser = require("body-parser");
app.use(express.urlencoded());
app.use(bodyParser.json());
const { authAdmin } = require("../middlewares/authAdmin");
app.use(express.static(__dirname + "/public"));


//logout
router.delete("/logout", actionController.logout_get);
// add users
router.post("/signup", actionController.signup_post);
// users login
router.post("/login", actionController.login_post);

//users
router.get(
  "/api/users",
  authAdmin(["erickykress@gmail.com"]),
  userController.users_get
); //get all
router.get(
  "/api/users/:id",
  authAdmin(["erickykress@gmail.com"]),
  userController.users_getOne
); //get single
router.put("/api/users/:id", userController.users_update); //updated one
router.delete("/api/users/:id", userController.users_delete); // delete one
//blogs
router.post("/api/blogs/add",
 authAdmin(["erickykress@gmail.com"]), 
 blogsController.blog_post); //add a blog
router.get("/api/blogs", blogsController.blog_get); //get all
router.get("/api/blogs/:id", blogsController.blog_getOne); //get single
router.put(
  "/api/blogs/:id",
  authAdmin(["erickykress@gmail.com"]),
  blogsController.blog_update
); //updated one
router.delete(
  "/api/blogs/:id",
  authAdmin(["erickykress@gmail.com"]),
  blogsController.blog_delete
); // delete one


module.exports = router;
