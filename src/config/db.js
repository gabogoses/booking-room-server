const mongoose = require('mongoose');

const DB_USER = process.env.MONGO_USER;
const DB_PWD = process.env.MONGO_PWD;
const DB_URL = process.env.MONGO_URL;
const DB_NAME = process.env.MONGO_DB_NAME;

const DB_STRING = `mongodb+srv://${DB_USER}:${DB_PWD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;

const connectDatabase = async () => {
    try {
        const connect = await mongoose.connect(DB_STRING);
        console.log(`MongoDB is connected: ${connect.connection.host}`);
    } catch (err) {
        console.error('An error occured:', err.mess);
    }
};

mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error', err);
});

module.exports = connectDatabase;
