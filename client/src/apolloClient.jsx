import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/scandiweb%20test/public/',
    credentials: 'same-origin'
  });

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

export default client;