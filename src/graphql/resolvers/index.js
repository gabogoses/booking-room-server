'use strict';

const companyResolvers = require('./company');
const eventResolvers = require('./event');
const roomResolvers = require('./room');
const userResolvers = require('./user');

const resolvers = {
    Query: {
        ...eventResolvers.Query,
        ...roomResolvers.Query,
        ...userResolvers.Query,
    },
    Mutation: {
        ...companyResolvers.Mutation,
        ...eventResolvers.Mutation,
        ...roomResolvers.Mutation,
        ...userResolvers.Mutation,
    },
};

module.exports = resolvers;
