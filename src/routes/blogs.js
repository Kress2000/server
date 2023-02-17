require('./blogSwagger')

require("dotenv").config();
const express = require("express");
const router = express.Router();
const actionController = require("../controllers/actionController");
const userController = require("../controllers/usersController");
const blogsController = require("../controllers/blogsController");
const { forwardAuthenticated } = require("../configs/auth");
const app = express();
const { blog } = require("../models/blogs");
app.use(express.json());
const bodyParser = require("body-parser");
app.use(express.urlencoded());
app.use(bodyParser.json());
const multer = require("multer");
const { authAdmin } = require("../middlewares/authAdmin");
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

// authAdmin(["erickykress@gmail.com"]) //check if yuo are admin
// authUser // check to see if you have signed in;
// const upload = multer({dest: '../../uploadedImg'});
const upload = multer({ storage: storage });
// Login Page
router.get("/login", forwardAuthenticated, (req, res) =>
  res.render({ message: "login" })
);
// Register Page
router.get("/signup", forwardAuthenticated, (req, res) =>
  res.render({ message: "signup" })
);
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
router.get(
  "/api/blogs",
  authAdmin(["erickykress@gmail.com"]),
  blogsController.blog_get
); //get all
router.get(
  "/api/blogs/:id",
  authAdmin(["erickykress@gmail.com"]),
  blogsController.blog_getOne
); //get single
router.put("/api/blogs/:id", blogsController.blog_update); //updated one
router.delete(
  "/api/blogs/:id",
  authAdmin(["erickykress@gmail.com"]),
  blogsController.blog_delete
); // delete one
//save the blogs as they admin add the blogs
router.post(
  "/api/blogs/add",
  upload.single("image"),
  async (req, res, next) => {
    console.log(req.file);
    const { title, description, category } = req.body;
    try {
      const newBlog = await blog.create({
        title,
        description,
        category,
        img: req.file.path,
        time: new Date().toISOString(),
      });
      console.log(newBlog, "created");
      res.status(201).json({ message: "Blog created", blog: newBlog });
    } catch (err) {
      console.log(err);
    }
  }
);
module.exports = router;
