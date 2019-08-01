const debug = require('debug')('app:authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const http = require('../util/httpStatus');
const Login = require('../models/Login');
const User = require('../models/User');
const config = require('../config/config');

const saltRounds = config.SALT_ROUNDS;

exports.login = function login(req, res, next) {

  if(!req.body.email && !req.body.password){ throw 'email and password required'; }

  if(!req.body.email){ throw 'email required'; }

  if(!req.body.password){ throw 'password required'; }

  let token
  let loginData

  Login.findOne({ email: req.body.email }).exec().then((result) => {
    if(result) { 
      loginData = result
      return bcrypt.compare(req.body.password, result.password) 
    } else { throw `user '${req.body.email}' does not exist` }
  }).then((bool) => {
    if(bool) {
      token = jwt.sign({ id: loginData._id, role: loginData.role, status: loginData.status }, config.SECRET, { expiresIn: '43200m' })
      return Login.findOneAndUpdate({ _id: loginData._id}, { '$push': { token: token } })
    } else { throw 'email and password doesnot match'}
  }).then(() => {
    return User.findById(loginData.userId)
  }).then((user) => {
    res.status(http.OK).send({
      status: true,
      data: { user: user, token: token },
      message: 'Successfully loggedin'
    });
  }).catch(err => next(err));
};


exports.logout = function logout (req, res, next) {
  Login.findOneAndUpdate({ _id: req.body.LOGIN_ID }, { token: [] }).then(result => {
    if(result){
      res.status(http.OK).send({
        status: 'success',
        data: null,
        message: 'successfully logged out'
      });
    } else { throw { name: 'Unauthorized' }}
  }).catch(err => next(err));
};
