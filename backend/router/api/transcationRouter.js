const router = require('express').Router();
const Transactions = require('../../controllers/TransactionController');
const authMiddleware = require('../../middlewares/isAuthenticated'); 

router.post("/transactions/purchase",authMiddleware, Transactions.purchaseCourse);

module.exports = router;
