'use strict';

const companyResolvers = require('./company');
const eventResolvers = require('./event');
const roomResolvers = require('./room');

const resolvers = {
    Query: {
        ...eventResolvers.Query,
        ...roomResolvers.Query,
    },
    Mutation: {
        ...companyResolvers.Mutation,
        ...eventResolvers.Mutation,
        ...roomResolvers.Mutation,
    },
};

module.exports = resolvers;
