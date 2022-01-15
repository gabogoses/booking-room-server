'use strict';

const companyResolvers = require('./company');
const eventResolvers = require('./event');

const resolvers = {
    Query: {
        ...eventResolvers.Query,
    },
    Mutation: {
        ...companyResolvers.Mutation,
        ...eventResolvers.Mutation,
    },
};

module.exports = resolvers;
