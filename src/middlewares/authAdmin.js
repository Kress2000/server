// const {user}= require('../models/users');
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = "secrete";

const authAdmin = (Permissions) => {
  return (req, res, next) => {
    const xx= null;
    const userEmail = req.body.email;
    if (Permissions.includes(userEmail)  ) {
      next();
    } else {
      res.status(401).json({ Error: "Not authorized! Only Admin" });
      // next();
    }
  };
};
module.exports = { authAdmin };
