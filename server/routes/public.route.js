const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/Login.controller');

//public routes
router.post('/login',LoginController.login);

router.post('/google-auth',LoginController.googleAuth);

module.exports = router;