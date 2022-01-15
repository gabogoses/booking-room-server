'use strict';

const { randomUUID } = require('crypto');
const mongoose = require('mongoose');
const { hash, compare } = require('bcryptjs');

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
    passwordChangedDate: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    this.password = await hash(this.password, 12);
});

userSchema.methods.evaluatePassword = async function (candidatePassword, userPassword) {
    return compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = randomUUID();

    this.passwordResetToken = resetToken;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
