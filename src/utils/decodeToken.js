const { verify } = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const decodeToken = (token) => {
    try {
        const payload = verify(token, JWT_SECRET);
        const { id, isAdmin } = payload;
        return { id, isAdmin, isAuthenticated: true };
    } catch (err) {
        console.error('An error occured:', err.message);
        return { isAuthenticated: false };
    }
};

module.exports = decodeToken;
