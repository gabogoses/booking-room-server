const moment = require('moment');
const { Event } = require('../models');

const isRoomBooked = async (events, eventStartTime) => {
    const eventsCopyList = [...events];

    const booleanList = await Promise.all(eventsCopyList.map(async (event) => {
        const { _id: eventId } = event;

        const { eventStartTime: bookedEventStartTime } = await Event.findById(eventId);

        const bookedEventStartHour = moment(bookedEventStartTime).hour();
        const currentEventStartHour = moment(eventStartTime).hour();

        if (currentEventStartHour === bookedEventStartHour) {
            return true;
        }

        return false;
    }));

    const isBooked = booleanList.includes(true);

    return isBooked;
};

module.exports = isRoomBooked;
