// const {user}= require('../models/users');
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = "secrete";

const authAdmin = (Permissions) => {
  return (req, res, next) => {
    // const authHeaders = req.headers['authorization'];
    // if(!authHeaders){
    //     res.status(401).json({error: "not authorized"})
    // }
    // const userToken = authHeaders.split(' ')[1];

    // console.log(userToken)
    // const decoded = jwt.verify(userToken, ACCESS_TOKEN_SECRET);
    // console.log(decoded);
    // const userEmail = 'erickykress1@gmail.com';
    const xx= null;
    const userEmail = req.body.email;
    if (Permissions.includes(userEmail) ) {
      next();
    } else {
      res.status(401).json({ Error: "Not authorized! Only Admin" });
      // next();
    }
  };
};
module.exports = { authAdmin };
