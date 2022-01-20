const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server');

const roomResolvers = {
    Query: {
        getRooms: async (_, args, { models }) => {
            try {
                return models.Room.find({}).populate({
                    path: 'events',
                    populate: { path: 'user' },
                });
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
        getRoom: async (_, { id }, { models }) => {
            if (!id) {
                throw new Error('Invalid user input');
            }

            try {
                return models.Room.findById(id).populate({
                    path: 'events',
                    populate: { path: 'user' },
                });
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
    },
    Mutation: {
        createRoom: async (_, { roomNumber, roomImage }, { isAdmin, isAuthenticated, models }) => {
            if (!isAuthenticated && !isAdmin) {
                throw new AuthenticationError('User is not allowed to create this ressource');
            }

            if (!roomNumber || !roomImage) {
                throw new UserInputError('Invalid user input');
            }

            try {
                const newRoom = new models.Room({ roomNumber, roomImage });
                await newRoom.save();

                return newRoom;
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
    },
};

module.exports = roomResolvers;
