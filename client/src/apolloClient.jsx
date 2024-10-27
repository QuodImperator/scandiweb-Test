import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
    uri: 'https://darko-site.rf.gd/graphql',
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