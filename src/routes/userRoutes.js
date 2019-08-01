const express = require('express');

const userRouter = express.Router();

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

userRouter.post('/bloodRequest', authenticate, userController.createBloodRequest);

module.exports = userRouter;
