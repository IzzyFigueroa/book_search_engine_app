import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react';
import {  BrowserRouter, Route, Routes } from 'react-router-dom'

import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error';
import App from './App.js'
import SearchBooks from './pages/SearchBooks.js'
import SavedBooks from './pages/SavedBooks.js'
import { StoreProvider } from './store/index.js'

import 'bootstrap/dist/css/bootstrap.min.css'
// Create an Apollo Client
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});
const link = from([
  errorLink,
  new HttpLink({ uri: '/graphql' })
]);

export const client = new ApolloClient({
  link, 
  cache: new InMemoryCache(),
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<SearchBooks />}/>
              <Route path="saved" element={<SavedBooks />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </ApolloProvider>
  </StrictMode>
)