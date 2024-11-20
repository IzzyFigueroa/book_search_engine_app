import { gql } from '@apollo/client';

// Auth Mutations
export const REGISTER_USER = gql`
mutation RegisterUser($username: String!, $email: String!, $password: String!) {
  registerUser(username: $username, email: $email, password: $password) {
    user {
      username
      _id
    }
  }
}
`;


export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    user {
      username
      _id
    }
  }
}
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser {
      message
    }
  }
`;

export const SAVE_BOOK = gql`
    mutation SaveBook($bookData: BookInput!) {
      saveBook(bookData: $bookData) {
        _id
        username
        email
        savedBooks {
          bookId
          authors
          description
          title
          image
          link
        }
      }
    }
`;

export const DELETE_BOOK = gql`
    mutation DeleteBook($bookId: ID!) {
      deleteBook(bookId: $bookId) {
        _id
        username
        email
        savedBooks {
          bookId
          authors
          description
          title
          image
          link
        }
      }
    }
`;