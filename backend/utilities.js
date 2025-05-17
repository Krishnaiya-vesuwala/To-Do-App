const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Assuming token is in "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: true, message: 'Token is required' });
    }

    jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: true, message: 'Invalid or expired token' });
        }
        
        req.user = decoded; 
        next();
    });
};

module.exports = { authenticateToken };
