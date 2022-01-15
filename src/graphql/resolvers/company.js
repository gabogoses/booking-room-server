'use strict';

const { ApolloError, AuthenticationError } = require('apollo-server');

const companyResolvers = {
    Mutation: {
        createCompany: async (_, { companyName }, { models }) => {
            if (!isAuthenticated && !isAdmin) {
                throw new AuthenticationError('User is not allowed to create this ressource');
            }

            if (!companyName) {
                throw new Error('Invalid user input');
            }

            try {
                const newCompany = new models.Company({ companyName });
                await newCompany.save();

                return newCompany;
            } catch (err) {
                console.error('An error occured', err.message);
                throw new ApolloError(err);
            }
        },
    },
};

module.exports = companyResolvers;
