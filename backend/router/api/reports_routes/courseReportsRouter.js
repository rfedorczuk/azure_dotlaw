// routes/emailInvitationsRouter.js
const express = require('express');
const router = express.Router();
const courseReportsRouter = require('../../../controllers/reports-controllers/courseReportController');
const authMiddleware = require('../../../middlewares/isAuthenticated'); 

router.get('/courses/:courseId',authMiddleware, courseReportsRouter.exportReportsToExcel);

module.exports = router;
