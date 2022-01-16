# Booking Room Server

### Welcome to the booking room app server

This server works with [Node.js](https://nodejs.org/en/), [Apollo Server](https://www.apollographql.com/docs/apollo-server/), [MongoDB Atlas](https://www.mongodb.com/atlas) and, [Mongoose](https://mongoosejs.com/).

It exposes a GraphQL deployed on [Heroku](https://www.heroku.com).

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.

`MONGO_USER` MongoDB username

`MONGO_PWD` MongoDB password

`MONGO_URL` MongoDB cluster URL

`MONGO_DB_NAME` MongoDB database name

`JWT_SECRET` Secure passphrase to sign and decode tokens

`JWT_EXPIRES_IN` Token expiration time

`SMTP_HOST` Using [mailtrap.io](https://mailtrap.io/) for testing purposes

`SMTP_PORT` mailtrap smtp port

`SMTP_USERNAME` mailtrap smtp username

`SMTP_PASSWORD` mailtrap smtp password

## Installation

Use git to clone the project. Install [Node.js > 14](https://nodejs.org/en/) and use the package manager [npm](https://docs.npmjs.com/) to install it the run:

```bash
npm install ci
```

and

```bash
npm run dev
```
