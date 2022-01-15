/* eslint-disable func-names */
const mongoose = require('mongoose');
const moment = require('moment');

const Room = require('./Room');
const User = require('./User');

const {
    Schema,
    Types: { ObjectId },
} = mongoose;

const eventSchema = new Schema({
    eventName: {
        type: String,
    },
    roomId: {
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
    userId: {
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

/**
 * Using the mongodb "Watch for Changes" stream to capture all deletion operations
 * of an event document.
 * https://docs.mongodb.com/drivers/node/current/usage-examples/changeStream/
 * https://docs.mongodb.com/manual/core/index-ttl/
 */

Event.watch().on('change', async (data) => {
    if (data.operationType === 'delete') {
        const { _id: deletedEventId } = data.documentKey;

        const findingEventRoom = await Room.find({ events: { $in: deletedEventId } });
        const findingUser = await User.find({ events: { $in: deletedEventId } });

        if (findingEventRoom.length === 1) {
            const room = findingEventRoom[0];
            const { _id: roomId } = room;
            await Room.updateOne({ _id: roomId }, { $pull: { events: ObjectId(deletedEventId) } });
        }

        if (findingUser.length === 1) {
            const user = findingUser[0];
            const { _id: userId } = user;
            await User.updateOne({ _id: userId }, { $pull: { events: ObjectId(deletedEventId) } });
        }
    }
});

module.exports = Event;
