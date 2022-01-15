'use strict';

const { ApolloError, AuthenticationError } = require('apollo-server');
const { signToken } = require('../../utils');

const eventResolvers = {
    Query: {
        me: async (_, {}, { id: currentUserId, isAuthenticated, models }) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            try {
                return models.User.findById(currentUserId).populate('events');
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
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
        login: async (_, { email, password }, { models }) => {
            if (!email || !password) {
                throw new Error('Invalid user inputs');
            }

            try {
                const user = await models.User.findOne({ email }).select('+password');
                const isValidPassword = await user.evaluatePassword(password, user.password);

                if (!user || !isValidPassword) {
                    throw new Error('Incorrect email or password');
                }

                const { _id: userId, isAdmin } = user;
                const token = signToken(userId, isAdmin);

                return { token };
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
        updateUser: async (_, { email, userId }, { id: currentUserId, isAuthenticated, models }) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            if (!email || !userId) {
                throw new Error('Invalid user inputs');
            }

            try {
                const user = await models.User.findById(userId).select('+password');

                if (currentUserId === userId) {
                    throw new AuthenticationError('User is not authorized to update this resource');
                }

                user.email = email;
                await user.save({ validateBeforeSave: true });

                return newRoom;
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
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
        updatePassword: async (_, { newPassword, confirmPassword }, { id: currentUserId, isAuthenticated, models }) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            if (!newPassword || !confirmPassword) {
                throw new Error('Invalid user input');
            }

            try {
                const user = await models.User.findById(currentUserId).select('+password');

                if (!user) {
                    throw new Error('No user found');
                }

                const isValidPassword = await user.evaluatePassword(confirmPassword, user.password);

                if (!isValidPassword) {
                    throw new Error('Current password is wrong!');
                }

                user.password = newPassword;
                await user.save({ validateBeforeSave: true });

                const { _id: userId, isAdmin } = user;

                const token = signToken(userId, isAdmin);

                return { token };
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
    },
};

module.exports = eventResolvers;
