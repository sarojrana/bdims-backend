const express = require('express');

const adminRouter = express.Router();

const authenticateAdmin = require('./../middleware/authenticateAdmin');
const adminController = require('../controllers/adminController')

adminRouter.use(authenticateAdmin)

adminRouter.get('/users', adminController.getAllUser);

adminRouter.post('/bloodDonation', adminController.createBloodDonation);

adminRouter.get('/bloodRequests', adminController.getAllBloodRequest);

adminRouter.post('/approveUser/:userId', adminController.approveUser);

module.exports = adminRouter;
