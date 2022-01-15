'use strict';

const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const eventSchema = new Schema({
    eventName: {
        type: String,
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    eventStartTime: {
        type: Date,
        required: true,
    },
    eventEndTime: {
        type: Date,
    },
    duration: {
        type: Number,
        default: 60,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    expiresAt: {
        type: Date,
        index: { expires: 0 },
    },
});

eventSchema.pre('save', function () {
    this.eventEndTime = moment(this.eventStartTime).utc().add(this.duration, 'minutes');
});

eventSchema.pre('save', function () {
    this.expiresAt = this.eventEndTime;
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
