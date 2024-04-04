const jwt = require('jsonwebtoken');

// Załaduj klucz sekretny z zmiennych środowiskowych
const { JWT_SECRET_KEY } = process.env;
console.log('JWT_SECRET_KEY  ',JWT_SECRET_KEY )
console.log('process.env.MYSQL_HOST ',process.env.MYSQL_HOST)

module.exports = (req, res, next) => {
    let token;

    // Próba odczytania tokenu z nagłówka 'Authorization' lub z ciasteczka
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1]; // Odczytanie tokenu z nagłówka
    } else if (req.cookies.token) {
        token = req.cookies.token; // Odczytanie tokenu z ciasteczka
    }

    // Sprawdzenie, czy token został dostarczony
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Weryfikacja tokenu
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.userId = decoded.userId; // Zapisanie ID użytkownika z tokenu do obiektu żądania

        // Uwierzytelniony użytkownik
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};
