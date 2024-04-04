const express = require('express');
const router = express.Router();
const adminCoursesController = require('../../../controllers/admin-controllers/AdminCoursesController');
const adminUsersController = require('../../../controllers/admin-controllers/AdminUsersController');
const authMiddleware = require('../../../middlewares/isAuthenticated'); 

router.get('/courses-count',authMiddleware, adminCoursesController.getCoursesWithCount);
router.get('/courses-info',authMiddleware, adminUsersController.getActiveCoursesInfo);
router.delete('/delete/:userId',authMiddleware, adminUsersController.deleteUser);

module.exports = router;
