'use strict';

require('dotenv').config();

const { ApolloServer } = require('apollo-server');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const connectDatabase = require('./config/db');
const models = require('./models');
const decodeToken = require('./utils/decodeToken');

connectDatabase();

const startApolloServer = async (typeDefs, resolvers) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const token = req.headers.authorization || '';

            if (token) {
                const { id, isAdmin, isAuthenticated } = decodeToken(token);
                return { isAdmin, id, isAuthenticated, models };
            }

            return { models };
        },
    });

    const { url, port } = await server.listen();
    console.log(`
        🚀  Server is running
        🔉  Listening on port ${port}
        📭  Query at ${url}
      `);
};

startApolloServer(typeDefs, resolvers);
