const express = require('express');
const router = express.Router();
const webMiddleware = require('../middlewares/web.middleware.js');
const adminApi = require('../middlewares/adminApi.middleware.js');
const AdminController = require('../controllers/Admin.controller.js');
 
//Middlewares
router.use(webMiddleware.verifyToken);
router.use(adminApi.adminApisPermission);

//routes
router.get('/all-users',AdminController.allUsers);
router.get('/get-payments',AdminController.getAllPayments);
router.get('/get-order-products/:orderId',AdminController.getOrderProducts);
router.get('/refundPayment/:orderCharge',AdminController.refundPayment);
router.get('/get-refunded-payments',AdminController.refundedPayments);
module.exports = router;