'use strict';

const { sign } = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const signToken = (id, isAdmin) => sign({ id, isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

module.exports = signToken;
