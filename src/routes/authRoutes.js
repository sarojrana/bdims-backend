const authRouter = require('express').Router();

const authController = require('../controllers/authController');

const authenticate = require('../middleware/authenticate');

authRouter.post('/login', authController.login);

authRouter.post('/logout', authenticate, authController.logout);

module.exports = authRouter;
