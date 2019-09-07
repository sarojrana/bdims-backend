const debug = require('debug')('app:dbConnection');

const User = require('../models/User');

const Login = require('../models/Login');

const bcrypt = require('bcrypt');

const config = require('../config/config');

const saltRounds = config.SALT_ROUNDS;

const mongoDB_URL = config.MONGODB_URI;

const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
}

let user = {
  firstName: 'Admin',
  lastName: '',
  age: 25,
  gender: 'MALE',
  mobile: '98000000',
  bloodGroup: 'A+',
  role: 'ADMIN',
  status: 'ACTIVE',
  verified: true,
  email: config.ADMIN_EMAIL,
}

const mongoose = require('mongoose').connect(mongoDB_URL, options)
  .then(() => {
    console.log('Successfully Connected to database!');
    return User.findOneAndUpdate({ email: user.email }, user, { upsert: true, new: true, setDefaultsOnInsert: true })
  }).then((newUser) => {
    user = newUser;
    const password = config.ADMIN_PASSWORD;
    return bcrypt.hash(password, saltRounds)
  }).then((hash) => {
    const login = {
      email: user.email,
      password: hash,
      role: user.role,
      status: user.status,
      userId: user._id
    }
    return Login.findOneAndUpdate({ email: user.email }, login, { upsert: true, new: true, setDefaultsOnInsert: true })
  }).then((login) => {
    console.log('success on creating user: ', login.email)
  }).catch(err => {
    console.log(err.message)
  });

mongoose.Promise = global.Promise;

module.exports = mongoose;
