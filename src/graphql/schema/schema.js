'use strict';

const { gql } = require('apollo-server');

const typeDefs = gql`
    type Company {
        id: ID!
        companyName: String!
    }

    type Mutation {
        createCompany(companyName: String): Company
    }
`;

module.exports = typeDefs;