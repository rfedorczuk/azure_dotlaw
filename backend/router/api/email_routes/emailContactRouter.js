// routes/emailInvitationsRouter.js
const express = require('express');
const router = express.Router();
const emailContactRouter = require('../../../controllers/email-controllers/contactController');
const authMiddleware = require('../../../middlewares/isAuthenticated'); 

router.post('/send',authMiddleware, emailContactRouter.sendEmail);

module.exports = router;
