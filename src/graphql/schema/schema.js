'use strict';

const { gql } = require('apollo-server');

const typeDefs = gql`
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

    type Query {
        getEvents: [Event]
        getEvent(id: ID): Event
    }

    type Mutation {
        createCompany(companyName: String): Company
        createEvent(user: String, eventName: String, eventStartTime: String, room: String): Event
        deleteEvent(id: ID): Event
        updateEvent(id: ID, user: String, eventName: String, eventStartTime: String, room: String): Event
    }
`;

module.exports = typeDefs;