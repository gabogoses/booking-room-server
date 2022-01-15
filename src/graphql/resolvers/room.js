'use strict';

const { ApolloError, AuthenticationError } = require('apollo-server');

const roomResolvers = {
    Query: {
        getRooms: async (_, {}, { models }) => {
            return 'READY';
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
