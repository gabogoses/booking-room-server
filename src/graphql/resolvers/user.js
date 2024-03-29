const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server');

const { sendMail, signToken } = require('../../utils');

const eventResolvers = {
    Query: {
        me: async (_, args, { id: currentUserId, isAuthenticated, models }) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            try {
                return models.User.findById(currentUserId).populate({
                    path: 'events',
                    populate: { path: 'roomId', populate: { path: 'events' } },
                });
            } catch (err) {
                console.log(err);
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
    },
    Mutation: {
        signup: async (_, { email, password }, { models }) => {
            if (!email || !password) {
                throw new UserInputError('Invalid user inputs');
            }

            try {
                const newUser = new models.User({ email, password });
                await newUser.save();

                const { _id: userId } = newUser;
                const token = signToken(userId);

                return {
                    user: newUser,
                    token,
                };
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
        login: async (_, { email, password }, { models }) => {
            if (!email || !password) {
                throw new UserInputError('Invalid user inputs');
            }

            try {
                const user = await models.User.findOne({ email }).select('+password');

                if (!user) {
                    throw new Error('Incorrect email or password');
                }
                const isValidPassword = await user.evaluatePassword(password, user.password);

                if (!isValidPassword) {
                    throw new Error('Incorrect email or password');
                }

                const { _id: userId, isAdmin } = user;
                const token = signToken(userId, isAdmin);

                return {
                    user,
                    token,
                };
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
        updateUser: async (
            _,
            { user: userId, email },
            { id: currentUserId, isAuthenticated, models },
        ) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            if (!email || !userId) {
                throw new UserInputError('Invalid user inputs');
            }

            try {
                const user = await models.User.findById(userId).select('+password');

                if (currentUserId !== userId) {
                    throw new AuthenticationError('User is not authorized to update this resource');
                }

                user.email = email;
                await user.save({ validateBeforeSave: true });

                const { isAdmin } = user;
                const token = signToken(userId, isAdmin);

                return { token };
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
        deleteUser: async (_, { user: userId }, { id: currentUserId, isAuthenticated, models }) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            if (currentUserId === userId) {
                throw new AuthenticationError('User is not authorized to update this resource');
            }

            try {
                await models.User.findByIdAndDelete(currentUserId);

                return {
                    message: 'User deleted',
                };
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
        forgotPassword: async (_, { email }, { models }) => {
            if (!email) {
                throw new UserInputError('Invalid user input');
            }

            const user = await models.User.findOne({ email });

            if (!user) {
                throw new Error(`There is no user with email address: ${email}`);
            }

            try {
                const resetToken = user.createPasswordResetToken();
                await user.save();

                const subject = 'Reset password instructions';
                const hotText = 'Change my password';
                const resetUrl = `https://example-website.com/reset-password/${resetToken}`;
                const message = `<b><strong>Hello ${email}</strong>, Forgot your password? Someone has request a link to change your password. You can do this through the button below.\n <a href=${resetUrl}>${hotText}</a></b></p>`;

                await sendMail({
                    recipient: email,
                    subject,
                    message,
                });

                return {
                    message: 'Email send',
                };
            } catch (err) {
                user.passwordResetExpires = undefined;
                user.passwordResetToken = undefined;
                await user.save();

                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
        resetPassword: async (_, { email, password, resetToken }, { models }) => {
            if (!email || !resetToken) {
                throw new UserInputError('Invalid user inputs');
            }

            try {
                const user = await models.User.findOne({
                    passwordResetToken: resetToken,
                    passwordResetExpires: { $gt: Date.now() },
                });

                if (!user) {
                    throw new Error('Token is invalid or has expired');
                }

                user.password = password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;

                await user.save();

                const { _id: userId, isAdmin } = user;

                const token = signToken(userId, isAdmin);

                return { token };
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
        updatePassword: async (
            _,
            { newPassword, confirmPassword },
            { id: currentUserId, isAuthenticated, models },
        ) => {
            if (!isAuthenticated) {
                throw new AuthenticationError('User is not authorized to access this resource');
            }

            if (!newPassword || !confirmPassword) {
                throw new UserInputError('Invalid user input');
            }

            try {
                const user = await models.User.findById(currentUserId).select('+password');

                if (!user) {
                    throw new Error('No user found');
                }

                const isValidPassword = await user.evaluatePassword(confirmPassword, user.password);

                if (!isValidPassword) {
                    throw new Error('Current password is wrong!');
                }

                user.password = newPassword;
                await user.save({ validateBeforeSave: true });

                const { _id: userId, isAdmin } = user;

                const token = signToken(userId, isAdmin);

                return { token };
            } catch (err) {
                console.error('An error occured:', err.message);
                throw new ApolloError(err);
            }
        },
    },
};

module.exports = eventResolvers;
