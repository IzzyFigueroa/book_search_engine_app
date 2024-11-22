import User from '../../models/User.js';
import { signToken } from '../../services/auth.js';
import { getErrorMessage } from '../../helpers/index.js';
import { GraphQLError } from 'graphql';
// const { sign } = jwt;
const auth_resolvers = {
    Query: {
        async getUser(_, __, context) {
            const user_id = context.req.user.id;
            if (!user_id) {
                return {
                    user: null
                };
            }
            const user = await User.findById(user_id).select('_id username savedBooks');
            if (!user) {
                return {
                    user: null
                };
            }
            return {
                user: user
            };
        }
    },
    Mutation: {
        async registerUser(_, args, context) {
            try {
                const user = await User.create(args);
                // Create a JWT token
                const token = signToken(user._id);
                // Send a cookie back with the JWT attached
                context.res.cookie('book_app_token', token, {
                    httpOnly: true,
                    secure: process.env.PORT ? true : false,
                    sameSite: true
                });
                return {
                    user: user
                };
            }
            catch (error) {
                const errorMessage = getErrorMessage(error);
                throw new GraphQLError(errorMessage);
            }
        },
        async loginUser(_, args, context) {
            const user = await User.findOne({ email: args.email });
            if (!user) {
                throw new GraphQLError("No user found with that email address");
            }
            const valid_pass = await user.validatePassword(args.password);
            if (!valid_pass) {
                throw new GraphQLError("Incorrect password");
            }
            const token = signToken(user._id);
            context.res.cookie('book_app_token', token, {
                httpOnly: true,
                secure: process.env.PORT ? true : false,
                sameSite: true
            });
            return user;
        },
        logoutUser: async (_, __, context) => {
            context.res.clearCookie('book_app_token');
            return {
                user: null,
                message: 'Logged out successfully!'
            };
        }
    }
};
export default auth_resolvers;
