const jwt = require('jsonwebtoken');

function verifyRole(roles) {
    return (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
            req.userId = decoded.userId;

            // Sprawdzanie roli użytkownika
            if (roles && roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied. You don’t have permission.' });
            }

            next();
        } catch (error) {
            res.status(400).json({ message: 'Invalid token.' });
        }
    }
}

module.exports = verifyRole;
