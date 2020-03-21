const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/images');
const isAuth = require('../middleware/auth');

router.get('/userAvatarUrls', isAuth, imagesController.getUserAvatarUrls);

router.get('/encounterAvatarUrls/:encounterId', isAuth, imagesController.getEncounterAvatarUrls);

module.exports = router;