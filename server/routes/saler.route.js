const express = require('express');
const router = express.Router();
const salerApi = require('../middlewares/salerApi.middleware');
const webMiddleware = require('../middlewares/web.middleware.js');

router.use(webMiddleware.verifyToken);
// router.use(salerApi.salerApiPermission);
//routes


module.exports = router;