'use strict';

const { ApolloError, AuthenticationError } = require('apollo-server');

const roomResolvers = {
    Query: {
        getRooms: async (_, {}, { models }) => {
            try {
                return models.Room.find({}).populate({
                    path: 'events',
                    populate: { path: 'user' },
                });
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
        getRoom: async (_, { id }, { models }) => {
            try {
                return models.Room.findById(id)
                    .populate('event')
                    .populate({
                        path: 'events',
                        populate: { path: 'user' },
                    });
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
    },
    Mutation: {
        createRoom: async (_, { roomNumber }, { isAdmin, isAuthenticated, models }) => {
            if (!isAuthenticated && !isAdmin) {
                throw new AuthenticationError('User is not allowed to create this ressource');
            }

            if (!roomNumber) {
                throw new Error('Invalid user input');
            }

            try {
                const newRoom = new models.Room({ roomNumber });
                await newRoom.save();

                return newRoom;
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
    },
};

module.exports = roomResolvers;
