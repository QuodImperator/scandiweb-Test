import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
    uri: window.location.hostname === 'localhost' 
      ? 'http://localhost:8080/graphql'
      : 'https://darko-site.rf.gd/graphql',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

export default client;