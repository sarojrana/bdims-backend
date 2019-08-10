const express = require('express');

const userRouter = express.Router();

const bloodGroup = require('../middleware/bloodGroup');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

userRouter.get('/', function(req, res){
  res.json({
    status: 'success',
    data: { user_id: req.body.id, role: req.body.role },
    message: 'This is user api'
  });
});

userRouter.post('/register', userController.createUser);

userRouter.get('/statistics', userController.statistics);

userRouter.use(authenticate);

userRouter.get('/profile', userController.getProfile);

userRouter.post('/bloodRequest', userController.createBloodRequest);

userRouter.get('/bloodRequests', userController.bloodRequestList);

userRouter.get('/donors', bloodGroup, userController.getDonorList);

module.exports = userRouter;
