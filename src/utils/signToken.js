const { sign } = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const { JWT_EXPIRES_IN } = process.env;

const signToken = (id, isAdmin) => sign({ id, isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

module.exports = signToken;
