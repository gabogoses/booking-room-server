'use strict';

const { ApolloError, AuthenticationError } = require('apollo-server');

const eventResolvers = {
    Query: {
        me: async (_, { id }, { models }) => {
            return 'READY';
        },
    },
    Mutation: {
        signup: async (_, {}, { models }) => {
            return 'READY';
        },
        login: async (_, {}, { models }) => {
            return 'READY';
        },
        updateUser: async (_, {}, { models }) => {
            return 'READY';
        },
        deleteUser: async (_, {}, { models }) => {
            return 'READY';
        },
        forgotPassword: async (_, {}, { models }) => {
            return 'READY';
        },
        resetPassword: async (_, {}, { models }) => {
            return 'READY';
        },
        updatePassword: async (_, {}, { models }) => {
            return 'READY';
        },
    },
};

module.exports = eventResolvers;
