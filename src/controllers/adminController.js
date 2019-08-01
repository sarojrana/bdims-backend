const User = require('../models/User')
const Donation = require('../models/Donation')
const BloodRequest = require('../models/BloodRequest')
const httpStatus = require('../util/httpStatus')

exports.getAllUser = (req, res, next) => {
  const query = {}
  if(req.query.gender) {
    query.gender = req.query.gender
  }
  if(req.query.status) {
    query.status = req.query.status
  }

  User.find(query).exec().then((users) => {
    users.forEach((user) => {
      if(user.docImage) {
        user.docImage = req.protocol + '://' + req.get('host') + '/' + user.docImage;
      } else { user.docImage = null }
    })
    res.status(httpStatus.OK).send({
      status: true,
      data: users,
      message: 'users retrieved successfully'
    })
  }).catch((err) => {
    next(err)
  })
} 

exports.getAllBloodRequest = (req, res, next) => {
  BloodRequest.find().exec().then((bloodRequests) => {
    res.status(httpStatus.OK).send({
      status: true,
      data: bloodRequests,
      message: 'list retrieved successfully'
    })
  }).catch((err) => {
    next(err)
  })
}

exports.approveUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findByIdAndUpdate(userId, { status: 'APPROVED' }).exec().then((result) => {
    res.status(httpStatus.OK).send({
      status: true,
      data: null,
      message: 'user approved'
    })
  }).catch((err) => {
    next(err)
  })
}

exports.createBloodDonation = (req, res, next) => {
  User.findById(req.body.userId).exec().then((user) => {
    const donation = new Donation({
      userId: user._id,
      date: req.body.date
    })
    return donation.save()
  }).then((result) => {
    res.status(httpStatus.CREATED).send({
      status: true,
      data: null,
      message: 'record added successfully'
    })
  }).catch((err) => {
    next(err)
  })
}
