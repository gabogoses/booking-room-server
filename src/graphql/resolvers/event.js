'use strict';

const { ApolloError, AuthenticationError } = require('apollo-server');

const eventResolvers = {
    Query: {
        getEvents: async (_, {}, { models }) => {
            return 'READY';
        },
        getEvent: async (_, { id }, { models }) => {
            return 'READY';
        },
    },
    Mutation: {
        createEvent: async (_, {}, { models }) => {
            return 'READY';
        },
        updateEvent: async (_, {}, { models }) => {
            return 'READY'
        },
        deleteEvent: async (_, { id: currentEventId }, {  }) => {
            return 'READY'
        }
    },
};

module.exports = eventResolvers;
