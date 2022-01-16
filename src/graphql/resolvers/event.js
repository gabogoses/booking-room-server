const { ApolloError, AuthenticationError } = require('apollo-server');
const { GraphQLScalarType, Kind } = require('graphql');
const moment = require('moment');

const { isRoomBooked } = require('../../utils');

const EVENT_DURATION_IN_MINUTES = 60;

const eventResolvers = {
    Query: {
        getEvents: async (_, args, { models }) => {
            try {
                return models.Event.find({}).populate({
                    path: 'roomId',
                    populate: { path: 'events' },
                });
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
        getEvent: async (_, { id }, { models }) => {
            if (!id) {
                throw new Error('Invalid user input');
            }

            try {
                return models.Event.findById(id).populate({
                    path: 'roomId',
                    populate: { path: 'events' },
                });
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
    },
    Mutation: {
        createEvent: async (
            _,
            { eventName, eventStartTime, roomId },
            { id: currentUserId, isAuthenticated, models },
        ) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not allowed to create this ressource');
            }

            if (!roomId || !eventStartTime) {
                throw new Error('Invalid user inputs');
            }

            try {
                const selectedEventRoom = await models.Room.findById(roomId);

                if (!selectedEventRoom) {
                    throw new Error('Cannot find room');
                }
                const { events } = selectedEventRoom;

                const isBooked = await isRoomBooked(events, eventStartTime);

                if (events.length >= 1 && isBooked) {
                    throw new Error('Room already booked');
                }

                const currentUser = await models.User.findById(currentUserId);

                if (!currentUser) {
                    throw new Error('Cannot find user');
                }

                const newEvent = new models.Event({
                    eventName,
                    roomId,
                    eventStartTime,
                    user: currentUserId,
                });

                const { _id: eventId } = newEvent;

                selectedEventRoom.events.push(eventId);
                currentUser.events.push(eventId);

                await currentUser.save();
                await selectedEventRoom.save();
                await newEvent.save();

                return newEvent;
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
        updateEvent: async (
            _,
            {
                eventId: currentEventId,
                eventName: currentEventName,
                eventStartTime,
                roomId: currentRoomId,
            },
            {
                id: currentUserId,
                isAuthenticated, models,
            },
        ) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            if (!currentEventId || !currentRoomId || !eventStartTime) {
                throw new Error('Invalid user inputs');
            }

            try {
                const getOriginalEvent = await models.Event.findById(currentEventId);

                const { user: originalUser } = getOriginalEvent;

                if (originalUser.toString() !== currentUserId) {
                    throw new AuthenticationError('User is not authorized to update this resource');
                }

                const selectedEventRoom = await models.Room.findById(currentRoomId);

                if (!selectedEventRoom) {
                    throw new Error('Cannot find room');
                }

                const { events } = selectedEventRoom;
                const isBooked = await isRoomBooked(events, eventStartTime);

                if (events.length >= 1 && isBooked) {
                    throw new Error('Room already booked');
                }

                const eventEndTime = moment(eventStartTime).utc().add(EVENT_DURATION_IN_MINUTES, 'minutes');

                const eventFilter = { _id: currentEventId };
                const update = {
                    eventName: currentEventName,
                    roomId: currentRoomId,
                    eventEndTime,
                    eventStartTime,
                    expiresAt: eventEndTime,
                };

                const event = await models.Event.findOneAndUpdate(
                    eventFilter,
                    update,
                    { new: true },
                );

                return event;
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
        deleteEvent: async (_, { eventId }, { id: currentUserId, isAuthenticated, models }) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            if (!eventId) {
                throw new Error('Invalid user input');
            }

            try {
                const getOriginalEvent = await models.Event.findById(eventId);

                if (!getOriginalEvent) {
                    throw new Error('Cannot find event');
                }

                const { user: originalUserId } = getOriginalEvent;

                if (originalUserId.toString() !== currentUserId) {
                    throw new AuthenticationError('User is not authorized to delete this resource');
                }

                await models.Event.findByIdAndDelete(eventId);

                return {
                    message: 'Event deleted',
                };
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        serialize(value) {
            return value.getTime();
        },
        parseValue(value) {
            return new Date(value);
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(parseInt(ast.value, 10));
            }
            return null;
        },
    }),
};

module.exports = eventResolvers;
