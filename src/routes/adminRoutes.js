const express = require('express');

const adminRouter = express.Router();

const bloodGroup = require('../middleware/bloodGroup');
const authenticateAdmin = require('./../middleware/authenticateAdmin');
const adminController = require('../controllers/adminController');

adminRouter.use(authenticateAdmin);

adminRouter.get('/users', bloodGroup, adminController.getAllUser);

adminRouter.post('/bloodDonation', adminController.createBloodDonation);

adminRouter.get('/bloodRequests', adminController.getBloodRequestList);

adminRouter.post('/approveBloodRequest/:id', adminController.approveBloodRequest);

adminRouter.delete('/deleteBloodRequest/:id', adminController.deleteBloodRequest);

adminRouter.delete('/delete/:userId', adminController.deleteUser);

adminRouter.get('/donationList', adminController.getDonationList);

adminRouter.delete('/deleteDonation/:id', adminController.deleteDonation);

module.exports = adminRouter;
