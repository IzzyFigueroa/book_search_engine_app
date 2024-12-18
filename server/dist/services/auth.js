import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const { sign, verify } = jwt;
export const signToken = (user_id) => {
    try {
        const token = sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '12h' });
        return token;
    }
    catch (error) {
        console.log('JWT TOKEN CREATION ERROR(signToken)', error);
        return false;
    }
};
export const getUserId = (req) => {
    const token = req.cookies?.book_app_token;
    if (!token)
        return null;
    try {
        const { user_id } = verify(token, process.env.JWT_SECRET);
        return user_id;
    }
    catch (error) {
        console.log('JWT VERIFICATON ERROR(auth.ts->getUserId)', error.message);
        return false;
    }
};
export const authenticate = async ({ req, res }) => {
    // Get the user's id from the request cookie
    const user_id = getUserId(req);
    // If they don't have a cookie or valid JWT, they are not authorized
    if (user_id) {
        req.user_id = user_id;
    }
    // Attach the user's id to the request object
    return { req, res };
};
