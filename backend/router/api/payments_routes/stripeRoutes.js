const router = require('express').Router();
const { createPaymentSession, verifyPaymentAndEnroll } = require('../../../controllers/payments-controllers/stripeController');
const authMiddleware = require('../../../middlewares/isAuthenticated'); 

router.post('/create-payment-session',authMiddleware, createPaymentSession);
router.post('/verify-payment-and-enroll',authMiddleware, verifyPaymentAndEnroll);

module.exports = router;
