const debug = require('debug')('app:dbConnection');

const User = require('../models/User');

const Login = require('../models/Login');

const bcrypt = require('bcrypt');

const config = require('../config/config');

const saltRounds = config.SALT_ROUNDS;

const mongoDB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodbank';

const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
}

let user = {
  firstName: 'Sandeep',
  lastName: 'Shrestha',
  age: 25,
  gender: 'MALE',
  mobile: '9860131264',
  bloodGroup: 'A+',
  role: 'ADMIN',
  status: 'ACTIVE',
  email: 'admin@gmail.com',
}

const mongoose = require('mongoose').connect(mongoDB_URL, options)
  .then(() => {
    console.log('Successfully Connected to database!');
    return User.findOneAndUpdate({ email: user.email }, user, { upsert: true, new: true, setDefaultsOnInsert: true })
  }).then((newUser) => {
    user = newUser;
    const password = 'admin';
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
