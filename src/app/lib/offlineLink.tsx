import { ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

const offlineQueue: { operation: any; forward: any; }[] = [];

const offlineLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    return response;
  });
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (networkError) {
    // Save the failed mutation to the queue
    offlineQueue.push({ operation, forward });
  }
});

const retryOfflineMutations = (client: { cache: { writeQuery: (arg0: { query: any; variables: any; data: any; }) => void; }; }) => {
  while (offlineQueue.length > 0) {
    const { operation, forward } = offlineQueue.shift() || {};
    forward(operation).subscribe({
      next: (response: { data: any; }) => {
        client.cache.writeQuery({
          query: operation.query,
          variables: operation.variables,
          data: response.data,
        });
      },
      error: (error: any) => {
        console.error('Failed to retry offline mutation', error);
        // If retry fails, add it back to the queue
        offlineQueue.push({ operation, forward });
      },
    });
  }
};

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Apollo-Require-Preflight': 'true'
    },
  };
});

export { offlineLink, errorLink, retryOfflineMutations, authLink };
