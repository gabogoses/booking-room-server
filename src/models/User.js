'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Tell us your email!'],
        lowercase: true,
        validate: {
            validator: (value) => {
                return /.+\@.+\..+/.test(value);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: 8,
        select: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
