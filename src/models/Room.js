'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const roomSchema = new Schema({
    roomNumber: {
        type: String,
        unique: true,
        match: /^C(01|02|03|04|05|06|07|08|09|10)|P(01|02|03|04|05|06|07|08|09|10)/,
        required: [true, 'Room number is required!'],
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
