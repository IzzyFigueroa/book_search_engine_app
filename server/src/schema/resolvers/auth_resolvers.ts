// import type { Request, Response } from 'express';
// import dotenv from 'dotenv'
import { Types } from 'mongoose';
import User from '../../models/User.js';
import { signToken } from '../../services/auth.js';
import { getErrorMessage } from '../../helpers/index.js';
import { GraphQLError } from 'graphql';
import Context from '../../interfaces/Context.js';

// dotenv.config()

// const { sign } = jwt;

const auth_resolvers = {
  Query: {
    async getUser(_: any, __: any, context: Context) {
      const user_id = context.req.user_id;

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
    async registerUser(_: any, args: { username: string; email: string; password: string }, context: Context) {
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
      } catch (error: any) {
        const errorMessage = getErrorMessage(error);


        throw new GraphQLError(errorMessage);
      }
    },
    async loginUser(_: any, args: { email: string; password: string }, context: Context) {
      const user = await User.findOne({ email: args.email });

      if (!user) {
        throw new GraphQLError("No user found with that email address");
      }


      const valid_pass = await user.validatePassword(args.password);

      if (!valid_pass) {
        throw new GraphQLError("Incorrect password");
      }

      const token = signToken(user._id as Types.ObjectId);

      context.res.cookie('book_app_token', token, {
        httpOnly: true,
        secure: process.env.PORT ? true : false,
        sameSite: true
      });

      return {
        user: user
      }
    },
    logoutUser: async (_: any, __: any, context: Context) => {
      context.res.clearCookie('book_app_token');
      return {
        user: null,
        message: 'Logged out successfully!'
      };
    }
  }
};

export default auth_resolvers;