'use strict';

const { ApolloError, AuthenticationError } = require('apollo-server');

const { getEventEndTime } = require('../../utils');

const eventResolvers = {
    Query: {
        getEvents: async (_, {}, { models }) => {
            try {
                return models.Event.find({}).populate({
                    path: 'room',
                    populate: { path: 'user' },
                });
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
        getEvent: async (_, { id }, { models }) => {
            if (!id) {
                throw new Error('Invalid user input');
            }

            try {
                return models.Event.findById(id).populate({
                    path: 'room',
                    populate: { path: 'user' },
                });
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
    },
    Mutation: {
        createEvent: async (_, { eventName, eventStartTime, room }, { id: currentUserId, isAuthenticated, models }) => {
            if (!isAuthenticated && !isAdmin) {
                throw new AuthenticationError('User is not allowed to create this ressource');
            }

            if (!room || !eventStartTime) {
                throw new Error('Invalid user inputs');
            }

            try {
                const selectedEventRoom = await models.Room.findById(room);

                if (!selectedEventRoom) {
                    throw new Error('Cannot find room');
                }

                const currentUser = await models.User.findById(currentUserId);

                if (!currentUser) {
                    throw new Error('Cannot find user');
                }

                const newEvent = new models.Event({
                    eventName,
                    room,
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
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
        updateEvent: async (
            _,
            { eventName: currentEventName, eventStartTime, room: currentRoomId },
            { id: currentUserId, isAuthenticated, models }
        ) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            if (!currentEventId || !currentRoomId || !eventStartTime) {
                throw new Error('Invalid user inputs');
            }

            try {
                const getOriginalEvent = await models.Event.findById(currentEventId);

                const { eventStartTime: originalEventStartTime, user: originalUserId } = getOriginalEvent;

                if (originalUserId !== currentUserId) {
                    throw new AuthenticationError('User is not authorized to update this resource');
                }

                const selectedRoom = await models.Room.findById(currentRoomId);

                if (!selectedRoom) {
                    throw new Error('Cannot find room');
                }

                const dateValues = {
                    eventStartTime,
                    originalEventStartTime,
                };

                const haveSameStartTime = originalEventStartTime === eventStartTime;

                let eventEndTime;

                haveSameStartTime
                    ? (eventEndTime = originalEventStartTime)
                    : (eventEndTime = getEventEndTime(dateValues));

                const event = await models.Event.findOneAndUpdate(
                    { _id: currentEventId },
                    {
                        currentEventName,
                        currentRoomId,
                        eventEndTime,
                        eventStartTime,
                        expiresAt: eventEndTime,
                    },
                    { new: true, validate: true }
                );

                return event;
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
        deleteEvent: async (_, { id: currentEventId }, { id: currentUserId, isAuthenticated, models }) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            if (!currentEventId) {
                throw new Error('Invalid user input');
            }

            try {
                const event = await models.Event.findById({ _id: currentEventId });

                if (!event) {
                    throw new Error('Cannot find event');
                }

                const { user: originalUserId } = getOriginalEvent;

                if (originalUserId === currentUserId) {
                    throw new AuthenticationError('User is not authorized to delete this resource');
                }

                await models.Event.findByIdAndDelete({ _id: id });
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
    },
};

module.exports = eventResolvers;
