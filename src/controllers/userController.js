const fs = require('fs')
const { promisify } = require('util')
const bcrypt = require('bcrypt')

const config = require('../config/config')
const User = require('../models/User')
const Login = require('../models/Login')
const BloodRequest = require('../models/BloodRequest')
const httpStatus = require('../util/httpStatus')
const upload = require('../middleware/upload')

const unlinkAsync = promisify(fs.unlink)

exports.createUser = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) { next(err) }
    else {
      let fullPath = null
      if (req.file) {
        fullPath = 'images/' + req.file.filename;
      }

      const user = new User({
        docImage: fullPath,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobile: req.body.mobile,
        email: req.body.email,
        gender: req.body.gender,
        dob: req.body.dob,
        addressId: req.body.addressId,
        role: req.body.role,
        bloodGroup: req.body.bloodGroup
      })
      
      let regUser
      user.save().then((newUser) => {
        regUser = newUser
        const password = req.body.password;
        return bcrypt.hash(password, config.SALT_ROUNDS)
      }).then((hash) => {
        const login = new Login({
          email: regUser.email,
          password: hash,
          role: regUser.role,
          status: regUser.status,
          userId: regUser._id
        })
        return login.save()
      }).then((loginData) => {
        res.status(httpStatus.CREATED).send({
          status: true,
          data: regUser,
          message: 'User successfully created'
        })
      }).catch((err) => {
        unlinkAsync(req.file.path)
        next(err)
      })
    }
  })
}

exports.createBloodRequest = (req, res, next) => {
  Login.findById(req.body.LOGIN_ID).exec().then((loginData) => {
    const bloodRequest = new BloodRequest({
      userId: loginData.userId,
      addressId: req.body.addressId,
      bloodGroup: req.body.bloodGroup,
      date: req.body.date
    })
    return bloodRequest.save()
  }).then((result) => {
    res.status(httpStatus.CREATED).send({
      status: true,
      data: result,
      message: 'blood request successful'
    })
  }).catch((err) => {
    next(err)
  })
}