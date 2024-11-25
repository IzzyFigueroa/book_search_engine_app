import express from 'express';
import dotenv from 'dotenv';

import path from 'node:path';

import cookieParser from 'cookie-parser';

import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';

import { authenticate } from './services/auth.js';
dotenv.config();
const server = new ApolloServer({
  typeDefs,
  resolvers
  
  
});

const app = express();
const PORT = process.env.PORT || 3001;


db.once('open', async () => {
  await server.start();

  app.use(
    '/graphql',
    express.urlencoded({ extended: true }),
    express.json(),
    cookieParser(),
    // load this after server start
    expressMiddleware(server, {
      context: authenticate,
    })
  );


// if we're in production, serve client/build as static assets and ensure the index.html file is served for the React Router to handle UI views
if (process.env.PORT) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  })
}



  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});