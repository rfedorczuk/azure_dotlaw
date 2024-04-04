const express = require('express');
const router = express.Router();
const adminCertificatesController = require('../../../controllers/admin-controllers/AdminCertificatesController');
const authMiddleware = require('../../../middlewares/isAuthenticated'); 

router.get('/get-certificates',authMiddleware, adminCertificatesController.getCoursesInfo);

module.exports = router;
