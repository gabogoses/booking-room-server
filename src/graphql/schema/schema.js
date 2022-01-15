'use strict';

const { gql } = require('apollo-server');

const typeDefs = gql`
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
        room: Room!
        user: User!
        eventStartTime: String!
        eventEndTime: String!
        duration: Int!
        company: Company!
        expiresAt: String!
    }

    type Message {
        message: String!
    }

    type Room {
        id: ID!
        roomNumber: String!
        events: [Event]
        user: User
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
        deleteUser(userId: ID): User
        forgotPassword(email: String): Message
        login(email: String, password: String): AuthPayLoad
        resetPassword(email: String, password: String, resetToken: String): AuthPayLoad
        signup(email: String, password: String): AuthPayLoad
        updatePassword(newPassword: String, confirmPassword: String): AuthPayLoad
        updateEvent(eventId: ID, eventName: String, eventStartTime: String, roomId: String): Event
        updateUser(userId: ID, email: String): AuthPayLoad
    }
`;

module.exports = typeDefs;
