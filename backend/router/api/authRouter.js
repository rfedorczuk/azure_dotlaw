const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');
// const auth = require('../../utils/auth');
const rateLimit = require('express-rate-limit');

// routers/authRouter.js

// Rejestracja
router.post('/register', AuthController.register);

// Aktywacja konta
router.get('/activate/:token', AuthController.activateAccount);

// Logowanie
const loginLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minut
   max: 3, // Limit 3 prób logowania z jednego IP
   message: "Zbyt wiele prób logowania z tego adresu IP. Spróbuj ponownie za 15 minut"
 });
  
  router.post('/login', AuthController.login);

router.get('/verify-token', (req, res) => {
    try {
        const token = req.cookies['token'];
        console.log('token verify-token')
        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            res.status(200).json({ valid: true });
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred.' });
    }
});


module.exports = router;
