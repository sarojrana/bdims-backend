const express = require('express')

const addressController = require('../controllers/addressController')

const addressRouter = express.Router()


addressRouter.get('/provinces', addressController.getProvinces)

addressRouter.get('/districts/:province', addressController.getDistrictByProvince)

module.exports = addressRouter