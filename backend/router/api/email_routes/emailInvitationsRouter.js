// routes/emailInvitationsRouter.js
const express = require('express');
const router = express.Router();
const emailInvitationsController = require('../../../controllers/email-invitations/emailInvitationsController');
const authMiddleware = require('../../../middlewares/isAuthenticated'); 

router.post('/send-invitations',authMiddleware, emailInvitationsController.sendInvitations);
router.post('/send-invitations-admin',authMiddleware, emailInvitationsController.sendInvitationsAdmin);


module.exports = router;
