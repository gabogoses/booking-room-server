'use strict';

const { ApolloError, AuthenticationError } = require('apollo-server');

const eventResolvers = {
    Query: {
        me: async (_, { id }, { models }) => {
            return 'READY';
        },
    },
    Mutation: {
        signup: async (_, { email, password }, { models }) => {
            if (!email || !password) {
                throw new Error('Invalid user inputs');
            }

            try {
                const newUser = new models.User({ email, password });
                await newUser.save();

                const { _id: userId } = newUser;
                const token = signToken(userId);

                return { token };
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
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
