import type { Request, Response } from 'express';
import dotenv from 'dotenv'
import {Types} from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();


const { sign, verify } = jwt;

interface JwtPayload {
  user_id: Types.ObjectId;
}

export const getUserId = (req: any) => {
  const token = req.cookies?.book_app_token;

  if (!token) return null;

  try {
    const { user_id } = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    return user_id;

  } catch (error: any) {
    console.log('JWT VERIFICATON ERROR(auth.ts->getUserId)', error.message);

    return null;
  }
}

export const signToken = (user_id: Types.ObjectId) => {
  try {
    const token = sign({ user_id }, process.env.JWT_SECRET!, { expiresIn: '12h' });
    
    return token;
  } catch (error) {
    console.log('JWT TOKEN CREATION ERROR(signToken)', error);
    return false;
  }
};

/* 
  Route middleware function that blocks an unauthenticated user from triggering a route and attaches the user_id to the req object
*/
export const authenticate = async ({req , res}: {req: Request, res: Response} )=> {
  // Get the user's id from the request cookie
  const user_id = getUserId(req);

  // If they don't have a cookie or valid JWT, they are not authorized
  if (user_id !== null) {
    req.user_id = user_id;
  }

 
  // Attach the user's id to the request object
  return{req, res};

  // Call the next route callback function

};