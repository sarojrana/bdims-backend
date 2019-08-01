const HTTP = require('./../util/httpStatus')
const Address = require('../models/Address')

exports.getProvinces = (req, res, next) => {
  Address.find().distinct('province').exec().then((provinces) => {
    res.status(HTTP.OK).send({
      status: true,
      data: provinces,
      message: 'successfully retrived'
    })
  }).catch((err) => {
    next(err);
  })
}

exports.getDistrictByProvince = (req, res, next) => {
  const province = req.params.province;
  Address.find({ province: province }).exec().then((districts) => {
    res.status(HTTP.OK).send({
      status: true,
      data: districts,
      message: 'successfully retrieved'
    })
  }).then((err) => {
    next(err);
  })
}
