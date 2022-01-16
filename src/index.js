require('dotenv').config();

const { ApolloServer } = require('apollo-server');

const connectDatabase = require('./config/db');
const { typeDefs, resolvers } = require('./graphql');
const models = require('./models');
const { decodeToken } = require('./utils');

connectDatabase();

const startApolloServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const token = req.headers.authorization || '';

            if (token) {
                const { id, isAdmin, isAuthenticated } = decodeToken(token);
                return {
                    isAdmin,
                    id,
                    isAuthenticated,
                    models,
                };
            }

            return { models };
        },
    });

    const { url, port } = await server.listen({ port: process.env.PORT || 4000 });
    console.log(`
        🚀  Server is running
        🔉  Listening on port ${port}
        📭  Query at ${url}
      `);
};

startApolloServer();
