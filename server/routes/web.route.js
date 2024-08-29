const express = require("express");
const router = express.Router();
const AuthController = require('../controllers/Auth.controller.js');
const LoginController = require('../controllers/Login.controller.js');
const webMiddleware = require('../middlewares/web.middleware.js');

//For authorization
router.use(webMiddleware.verifyToken);

// routes
router.get('/authenticate-user',AuthController.Auth);
router.get('/logout',LoginController.logout);

module.exports = router;

