import { ApolloClient, InMemoryCache, makeVar, createHttpLink } from '@apollo/client';

export const currentUserVar = makeVar(null);

const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_BACKEND_API_URL,
  credentials: 'include', // This is crucial for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          currentUser: {
            read() {
              return currentUserVar();
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      context: {
        credentials: 'include',
      },
    },
    query: {
      fetchPolicy: 'network-only',
      context: {
        credentials: 'include',
      },
    },
  },
});

export default client;
