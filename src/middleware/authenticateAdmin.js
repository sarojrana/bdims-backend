const authenticateAdmin = require('express').Router();
const Login = require('../models/Login'); 

authenticateAdmin.use((req, res, next) => {
  Login.findById(req.body.LOGIN_ID).then((result) => {
    if(result && result.role === 'ADMIN') { next(); } 
    else { throw { name: 'UnauthorizedError' } };
  }).catch( err => { next(err) });
})

module.exports = authenticateAdmin;