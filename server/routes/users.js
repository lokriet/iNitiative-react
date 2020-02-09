const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const isAuth = require('../middleware/auth');


/**
 * Get logged in user info
 */
router.get('/userinfo', isAuth, userController.getUserInfo);

module.exports = router;
