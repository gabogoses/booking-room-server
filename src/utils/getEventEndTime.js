'use strict';

const moment = require('moment');

const EVENT_DURATION_IN_MINUTES = 60;

const getEventEndTime = (eventStartTime) => moment(eventStartTime).utc().add(EVENT_DURATION_IN_MINUTES, 'minutes');

module.exports = getEventEndTime;
