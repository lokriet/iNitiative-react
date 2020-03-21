const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const isAuth = require('../middleware/auth');


/**
 * Get user info about auth token owner
 * http://localhost:3001/users/userinfo GET 
 * 
 * Get logged in user info
 *  
 * ==Response==
 * Success:
 * status: 200
 * body: {
 *  username
 *  email
 *  id
 *  isAdmin
 * }
 * 
 * Failure:
 * status: 401
 * message: Not Authenticated
 * 
 * internal server error:
 * status: 500
 * message
 */
router.get('/userinfo', isAuth, userController.getUserInfo);


router.get('/avatarUrls', isAuth, userController.getUserAvatarUrls);

module.exports = router;
