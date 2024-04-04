const router = require('express').Router();
const pool = require('../../../config/db');
const authMiddleware = require('../../../middlewares/isAuthenticated'); 

router.get('/discount-code/:code',authMiddleware, async (req, res) => {
    const { code } = req.params;
    const totalAmountBeforeDiscount = parseFloat(req.query.totalAmount); // Pobierz kwotę z parametru zapytania
  
    if (isNaN(totalAmountBeforeDiscount)) {
      return res.status(400).json({ success: false, message: 'Nieprawidłowa kwota całkowita' });
    }
  
    try {
      const [rows] = await pool.query('SELECT * FROM discount_codes WHERE code = ? AND valid_until > NOW()', [code]);
      if (rows.length > 0) {
        const discountPercent = rows[0].discount_percent;
        const newTotalAmount = totalAmountBeforeDiscount - (totalAmountBeforeDiscount * (discountPercent / 100));
        res.json({
          success: true,
          newTotalAmount: newTotalAmount.toFixed(2), // Zaokrągl do dwóch miejsc po przecinku
          message: `Zastosowano kod rabatowy: ${code}`
        });
      } else {
        res.status(404).json({ success: false, message: 'Nie ma takiego kodu lub kod wygasł' });
      }
    } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).json({ success: false, message: 'Błąd serwera' });
    }
  });
  

module.exports = router;
