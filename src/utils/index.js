'use strict';

const decodeToken = require('./decodeToken');
const getEventEndTime = require('./getEventEndTime');
const sendMail = require('./sendMail');
const signToken = require('./signToken');

module.exports = {
    decodeToken,
    getEventEndTime,
    sendMail,
    signToken,
};
