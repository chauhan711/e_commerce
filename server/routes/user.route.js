const express = require('express');
const router = express.Router();
const userApi = require('../middlewares/userApi.middleware');
const webMiddleware = require('../middlewares/web.middleware.js');
const UserController = require('../controllers/User.controller');

//middleware
router.use(webMiddleware.verifyToken);
router.use(userApi.userApiPermission);

//routes
router.get('/get-products',UserController.getAllProducts);
router.get('/add-to-cart/:product_id',UserController.addToCart);
router.get('/get-user-products',UserController.getUserProducts);
router.post('/generate-otp',UserController.generateOtp);

//make payment
router.post('/payment',UserController.makePayment);

//paypal
router.post('/create-payment-paypal',UserController.createPaypalPayment)
router.post('/capture-paypal-order',UserController.capturePaypalPayment);

//chat system
router.post('/user-chat',UserController.chatWithAdmin)
router.get('/user-conversations/:id',UserController.UserConversations)

module.exports = router;