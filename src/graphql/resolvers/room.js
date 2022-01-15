'use strict';

const { ApolloError, AuthenticationError } = require('apollo-server');

const roomResolvers = {
    Query: {
        getRooms: async (_, {}, { models }) => {
            try {
                return models.Room.find({}).populate('events');
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
        getRoom: async (_, { id }, { models }) => {
            return 'READY';
        },
    },
    Mutation: {
        createRoom: async (_, { roomNumber }, { models }) => {
            return 'READY';
        },
    },
};

module.exports = roomResolvers;
