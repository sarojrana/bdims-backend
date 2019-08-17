const express = require('express');

const userRouter = express.Router();

const bloodGroup = require('../middleware/bloodGroup');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

userRouter.post('/register', userController.createUser);

userRouter.get('/statistics', userController.statistics);

userRouter.get('/placesAutocomplete', userController.getGooglePlaceList);

userRouter.use(authenticate);

userRouter.get('/profile', userController.getProfile);

userRouter.get('/addressStatus', userController.addressStatus);

userRouter.post('/updateUserLocation', userController.updateUserAddress);

userRouter.post('/bloodRequest', userController.createBloodRequest);

userRouter.get('/bloodRequests', userController.bloodRequestList);

userRouter.get('/donors', bloodGroup, userController.getDonorList);

module.exports = userRouter;
