import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
    // For local development
    uri: 'http://localhost:8080/graphql',
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