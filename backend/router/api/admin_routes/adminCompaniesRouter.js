const express = require('express');
const router = express.Router();
const adminCompaniesController = require('../../../controllers/admin-controllers/AdminCompaniesController');
const authMiddleware = require('../../../middlewares/isAuthenticated'); 

router.get('/get-companies',authMiddleware, adminCompaniesController.getCompanies);

router.post('/add-voucher/:companyId',authMiddleware, adminCompaniesController.addCompanyVoucher);

router.put('/update/:companyId',authMiddleware, adminCompaniesController.updateCompanyName);

router.delete('/delete/:companyId',authMiddleware, adminCompaniesController.deleteCompany);

module.exports = router;
