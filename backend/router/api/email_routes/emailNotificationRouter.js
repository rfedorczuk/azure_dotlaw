// routes/emailInvitationsRouter.js
const express = require('express');
const router = express.Router();
const emailINotificationController = require('../../../controllers/email-controllers/notificationController');
const authMiddleware = require('../../../middlewares/isAuthenticated'); 

router.post('/send-reminder',authMiddleware, emailINotificationController.sendReminder);

module.exports = router;
