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
            try {
                return models.Room.findById(id).populate('event').populate('user');
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
    },
    Mutation: {
        createRoom: async (_, { roomNumber }, { models }) => {
            return 'READY';
        },
    },
};

module.exports = roomResolvers;
