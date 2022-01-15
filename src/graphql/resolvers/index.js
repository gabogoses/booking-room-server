'use strict';

const companyResolvers = require('./company');

const resolvers = {
    Query: {
    },
    Mutation: {
        ...companyResolvers.Mutation,
    }
}

module.exports = resolvers;
