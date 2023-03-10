require('dotenv').config()
const express = require('express')
const app = express()
const { blog } = require('../models/blogs')
app.use(express.json())
const bodyParser = require('body-parser')
app.use(express.urlencoded())
app.use(bodyParser.json())
const path = require('path')
module.exports.blog_get = (req, res) => {
  blog.find({}, (err, data) => {
    if (!err) {
      res.send(data)
    } else {
      console.log(err)
    }
  })
}
//get single blog basing on its id
module.exports.blog_getOne = (req, res) => {
  blog.findById(req.params.id, (err, data) => {
    !err ? res.send(data) : console.log(err)
  })
}
//Update single blog basing on his id
module.exports.blog_update = (req, res) => {
  const updatedBlog = {
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    category: req.body.category,
    time: new Date().toISOString(),
    userActions: {
      comments: req.body.category,
      likes: req.body.category,
    },
  }
  blog.findByIdAndUpdate(
    req.params.id,
    { $set: updatedBlog },
    { new: true },
    (err, data) => {
      !err
        ? res.status(202).json({
            code: 202,
            message: 'Changes accepted',
            updateUser: data,
          })
        : console.log(err)
    },
  )
}
//delete  single blog basing on its id
module.exports.blog_delete = (req, res) => {
  blog.findByIdAndRemove(req.params.id, (err, data) => {
    if (!err) {
      res.status(202).json({
        code: 202,
        message: 'blog deleted successfully',
        removedUser: data,
      })
    } else {
      console.log(err)
    }
  })
}
// require('') path.join(process.cwd(), '/uploads')
// const multer = require('multer')
// const StorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '/upload')
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + file.originalname)
//   },
// })
// const upload = multer({ storage: StorageEngine })
const timer = new Date();
const second = timer.getMilliseconds();
const randomN = Math.random(10);
const newId = second + randomN;
console.log(newId)

module.exports.blog_post = async(req, res) => {
  // upload.single("img"),
  const { title, description, img, category, userActions } = req.body
  const newBlog = await blog
    .create({
      title,
      description,
      category,
      img,
      id: newId,
      time: new Date().toISOString(),
      userActions: userActions ? userActions : {},
    });
    res.status(201).json({ message: 'New Blog created', blog: newBlog })
}
