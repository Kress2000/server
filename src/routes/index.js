const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../configs/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
  res.status(200).send({"message": "Welcome home!"});
  // return res.render('index')
});

// Dashboard
router.get('/blogs', ensureAuthenticated, (req, res) =>
  // res.render('blogs', {
  //   user: req.user
  // })
  res.status(200).json({message: "Dashboard"})
);``

module.exports = router;
