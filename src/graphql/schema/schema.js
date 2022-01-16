const { gql } = require('apollo-server');

const typeDefs = gql`
    scalar Date

    type AuthPayLoad {
        token: String!
    }

    type Company {
        id: ID!
        companyName: String!
    }

    type Event {
        id: ID!
        eventName: String!
        roomId: Room!
        eventStartTime: Date!
        eventEndTime: Date!
        duration: Int!
        user: User
        expiresAt: Date!
    }

    type Message {
        message: String!
    }

    type Room {
        id: ID!
        roomNumber: String!
        events: [Event]
    }

    type User {
        id: ID!
        email: String!
        password: String
        events: [Event]
    }

    type Query {
        getRooms: [Room]
        getRoom(id: ID): Room
        getEvents: [Event]
        getEvent(id: ID): Event
        me: User
    }

    type Mutation {
        createCompany(companyName: String): Company
        createEvent(eventName: String, eventStartTime: String, roomId: String): Event
        createRoom(roomNumber: String): Room
        deleteEvent(eventId: ID): Message
        deleteUser(user: ID): User
        forgotPassword(email: String): Message
        login(email: String, password: String): AuthPayLoad
        resetPassword(email: String, password: String, resetToken: String): AuthPayLoad
        signup(email: String, password: String): AuthPayLoad
        updatePassword(newPassword: String, confirmPassword: String): AuthPayLoad
        updateEvent(eventId: ID, eventName: String, eventStartTime: String, roomId: String): Event
        updateUser(user: ID, email: String): AuthPayLoad
    }
`;

module.exports = typeDefs;
