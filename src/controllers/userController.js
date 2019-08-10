const fs = require('fs')
const { promisify } = require('util')
const bcrypt = require('bcrypt')

const config = require('../config/config')
const User = require('../models/User')
const Login = require('../models/Login')
const Donation = require('../models/Donation')
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
        province: req.body.province,
        district: req.body.district,
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
        // unlinkAsync(req.file.path)
        next(err)
      })
    }
  })
}

exports.createBloodRequest = (req, res, next) => {
  Login.findById(req.body.LOGIN_ID).exec().then((loginData) => {
    const bloodRequest = new BloodRequest({
      userId: loginData.userId,
      province: req.body.province,
      district: req.body.district,
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

exports.bloodRequestList = (req, res, next) => {
  Login.findById(req.body.LOGIN_ID).exec().then((loginData) => {
    return BloodRequest.find({ userId: loginData.userId }).populate('addressId')
  }).then((bloodRequests) => {
    res.status(httpStatus.OK).send({
      status: true,
      data: bloodRequests,
      message: 'successfully retrieved'
    })
  }).catch((err) => {
    next(err)
  })
}

exports.statistics = async (req, res, next) => {
  let stats = {};
  try {
    stats.donors = await User.countDocuments({ role: 'DONOR' });
    stats.members = await User.countDocuments({ role: 'MEMBER' });
    stats.donations = await Donation.countDocuments();
    stats.bloodRequests = await BloodRequest.countDocuments();
    await res.status(httpStatus.OK).send({
      status: true,
      data: stats,
      message: 'statistics retrieved successfully'
    })
  } catch (err) {
    next(err)
  }
}

exports.getProfile = (req, res, next) => {
  Login.findById(req.body.LOGIN_ID).exec().then((loginData) => {
    return User.findById(loginData.userId)
  }).then((user) => {
    res.status(httpStatus.OK).send({
      status: true,
      data: user,
      message: 'profile retrieved successfully'
    })
  }).catch((err) => {
    next(err)
  })
}

exports.getDonorList = (req, res, next) => {
  const query = {
    role: 'DONOR'
  }
  if(req.query.gender) {
    query.gender = req.query.gender
  }
  
  if(req.query.bloodGroup) {
    query.bloodGroup = req.query.bloodGroup
  }

  if(req.query.district) {
    query.district = req.query.district
  }

  if(req.query.province) {
    query.province = req.query.province
  }

  Login.findById(req.body.LOGIN_ID).exec().then((loginData) => {
    query._id = { $ne: loginData.userId }
    return User.find(query, '-docImage')
  }).then((donors) => {
    res.status(httpStatus.OK).send({
      status: true,
      data: donors,
      message: 'donors retrieved successfully'
    })
  }).catch((err) => {
    next(err)
  })
} 