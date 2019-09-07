const express = require('express');

const userRouter = express.Router();

const bloodGroup = require('../middleware/bloodGroup');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authenticateUserVerification = require('../middleware/authenticateUser');

userRouter.post('/register', userController.createUser);

userRouter.get('/statistics', userController.statistics);

userRouter.get('/placesAutocomplete', userController.getGooglePlaceList);

userRouter.get('/verify/:loginId', userController.verifyUser);

userRouter.use(authenticate);

userRouter.get('/profile', userController.getProfile);

userRouter.post('/updateProfile', userController.updateProfile);

userRouter.get('/addressStatus', userController.addressStatus);

userRouter.post('/updateUserLocation', userController.updateUserAddress);

userRouter.get('/donors', bloodGroup, userController.getDonorList);

userRouter.use(authenticateUserVerification);

userRouter.post('/bloodRequest', userController.createBloodRequest);

userRouter.get('/bloodRequests', userController.bloodRequestList);

userRouter.get('/mailTest', userController.mailTest);

module.exports = userRouter;
