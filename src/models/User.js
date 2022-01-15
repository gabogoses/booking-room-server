'use strict';

const mongoose = require('mongoose');
const { hash } = require('bcryptjs');

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

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    this.password = await hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
