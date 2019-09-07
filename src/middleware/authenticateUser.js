const authenticateUser = require('express').Router();
const Login = require('../models/Login'); 
const User = require('../models/User');

authenticateUser.use((req, res, next) => {
  Login.findById(req.body.LOGIN_ID).then((loginData) => {
    return User.findById(loginData.userId)
  }).then(user => {
    if(user && user.verified) { next(); } 
    else { throw { name: 'UnauthorizedError', message: 'User unverified' } };
  }).catch( err => { next(err) });
})

module.exports = authenticateUser;