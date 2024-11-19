import express from 'express';
import {
  getUserBooks,
  saveBook,
  deleteBook
} from '../../models/schemas/resolvers/user_resolvers.js';
import { authenticate } from '../../services/auth.js';

const router = express.Router();

/* 
  These routes are for authenticated users (a user that has a valid cookie and JWT)
*/

// Retreives all books for the logged in user(It will return an empty array if there is no client cookie)
router.get('/books', getUserBooks);
// Save a book for the logged in user
router.put('/books', authenticate, saveBook);
// Delete a book for the logged in user
router.delete('/book/:bookId', authenticate, deleteBook);


export default router;
