const fs = require('fs')
const { promisify } = require('util')
const bcrypt = require('bcrypt')
const request = require('request-promise-native')

const config = require('../config/config')
const User = require('../models/User')
const Login = require('../models/Login')
const Donation = require('../models/Donation')
const BloodRequest = require('../models/BloodRequest')
const httpStatus = require('../util/httpStatus')
const constant = require('../util/constant')
const upload = require('../middleware/upload')
const cloudinary = require('../config/cloudinaryConfig')

const unlinkAsync = promisify(fs.unlink)

const googleMapsClient = require('@google/maps').createClient({
  key: config.GOOGLE_API_KEY,
  Promise: Promise
})

const googleSessionToken = require('@google/maps').util.placesAutoCompleteSessionToken()

exports.createUser = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) { next(err) }
    else {
      let fullPath = null
      if (req.file) {
        fullPath = 'images/' + req.file.filename;
      }
      
      let regUser
      cloudinary.uploads(req.file.path).then(result => {
        const user = new User({
          docImage: result.url,
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
        return user.save()
      }).then((newUser) => {
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

exports.updateProfile = (req, res, next) => {
  Login.findById(req.body.LOGIN_ID).exec().then((loginData) => {
    const query = {};
    if(req.body.firstName) {
      query.firstName = req.body.firstName
    }
    if(req.body.lastName) {
      query.lastName = req.body.lastName
    }
    if(req.body.dob) {
      if(isDOBValid(req.body.dob)){
        query.dob = req.body.dob
      }
    }
    if(req.body.bloodGroup) {
      if(constant.bloodGroups.includes(req.body.bloodGroup)) {
        query.bloodGroup = req.body.bloodGroup
      }
    }

    if(req.body.gender) {
      if(constant.gender.includes(req.body.gender)) {
        query.gender = req.body.gender
      }
    }

    return User.findByIdAndUpdate(loginData.userId, query, { upsert: true })
  }).then((result) => {
    res.status(httpStatus.CREATED).send({
      status: true,
      data: null,
      message: 'profile updated successfully'
    })
  }).catch(err => {
    next(err)
  })
}

function isDOBValid(date) {
  const presentDate = new Date();
  const dobDate = new Date(date);
  const diff = presentDate.getFullYear() - dobDate.getFullYear();
  if(diff > 17) {
    return true;
  }
  return false;
}

exports.addressStatus = (req, res, next) => {
  Login.findById(req.body.LOGIN_ID).exec().then((loginData) => {
    return User.findById(loginData.userId)
  }).then((user) => {
    if(user.province && user.district && user.latlng) {
      res.status(httpStatus.OK).send({
        status: true,
        data: 'COMPLETE',
        message: 'address is complete'
      })
    } else {
      res.status(httpStatus.OK).send({
        status: true,
        data: 'INCOMPLETE',
        message: 'address is incomplete'
      })
    }
  }).catch(err => {
    next(err)
  })
}

exports.updateUserAddress = async (req, res, next) => {
  let query = {}

  if(req.body.province) {
    query.province = req.body.province
  }
  if(req.body.district) {
    query.district = req.body.district
  }

  try {
    const result = await googleMapsClient.place({
                      placeid: req.body.placeId,
                      language: 'en',
                      fields: ['formatted_address', 'name', 'geometry']
                    }).asPromise()
    const location = await result.json.result.geometry.location
    query.latlng = await `${location.lat},${location.lng}`
    query.location = await result.json.result.formatted_address
    const loginData = await Login.findById(req.body.LOGIN_ID)
    const user = await User.findByIdAndUpdate(loginData.userId,
      query, { upsert: true })
    if(user) {
      res.status(httpStatus.OK).send({
        status: true,
        data: null,
        message: 'user location updated successfully'
      })
    } else {
      throw 'failed to update'
    }
  } catch(err) {
    next(err)
  }
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
    stats.donors = await User.countDocuments({ role: 'DONOR', status: { $ne: 'DELETED'} });
    stats.members = await User.countDocuments({ role: 'MEMBER', status: { $ne: 'DELETED'} });
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

exports.getDonorList = async (req, res, next) => {
  let user
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

  Login.findById(req.body.LOGIN_ID).exec()
  .then((loginData) => {
    return User.findById(loginData.userId)
  }).then((data) => {
    user = data
    query._id = { $ne: user._id }
    return User.find(query, '-docImage')
  }).then((donors) => {
    return Promise.all(
      donors.map(async donor => {
        let dummyDonor = {
          _id: donor._id,
          firstName: donor.firstName,
          lastName: donor.lastName,
          email: donor.email,
          mobile: donor.mobile,
          gender: donor.gender,
          age: donor.age || null,
          bloodGroup: donor.bloodGroup,
          province: donor.province || null,
          district: donor.district || null,
          location: donor.location || null,
          distance: null,
          time: null,
          role: donor.role,
          status: donor.status
        }
        if(donor.latlng && user.latlng) {
          const options = {
            uri: `https://graphhopper.com/api/1/matrix?point=${user.latlng}&point=${donor.latlng}&
                  type=json&vehicle=car&out_array=distances&out_array=times&key=${config.GRASSHOPPER_API_KEY}`,
            method: 'GET',
            json: true
          }
          const distance = await request(options)
          dummyDonor.distance = await (distance.distances[1][0]/1000).toFixed(2) || null
          dummyDonor.time = await Math.ceil((distance.times[1][0]/60)) || null
        }
        return await dummyDonor
      })
    )
  }).then((donorList) => {
    donorList.sort();
    res.status(httpStatus.OK).send({
      status: true,
      data: donorList,
      message: 'donors retrieved successfully'
    })
  }).catch((err) => {
    next(err)
  })
} 

exports.getGooglePlaceList = (req, res, next) => {
  googleMapsClient.placesAutoComplete({
    input: req.query.search || '',
    language: 'en',
    components: { country: 'np' },
    sessiontoken: googleSessionToken
  }).asPromise()
  .then((response) => {
    const data = response.json.predictions.map(({description, place_id}) => ({ description, place_id }))
    res.send({
      status: true,
      data: data,
      message: 'List retrieved successfully'
    })
  })
  .catch((err) => {
    next(err)
  });
}
