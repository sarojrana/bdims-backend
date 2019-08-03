const express = require('express');

const adminRouter = express.Router();

const authenticateAdmin = require('./../middleware/authenticateAdmin');
const adminController = require('../controllers/adminController')

adminRouter.use(authenticateAdmin)

adminRouter.get('/users', adminController.getAllUser);

adminRouter.post('/bloodDonation', adminController.createBloodDonation);

adminRouter.get('/bloodRequests', adminController.getBloodRequestList);

adminRouter.post('/approveBloodRequest/:id', adminController.approveBloodRequest);

adminRouter.post('/approveUser/:userId', adminController.approveUser);

adminRouter.get('/donationList', adminController.getDonationList);

module.exports = adminRouter;
