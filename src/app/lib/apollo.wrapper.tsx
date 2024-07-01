"use client";

import {
  ApolloLink,
} from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";
// @ts-ignore
import { createUploadLink } from 'apollo-upload-client';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';
import { setContext } from '@apollo/client/link/context';

const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Apollo-Require-Preflight': 'true'
    },
  };
});

if (typeof window !== 'undefined') {
  persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });
}

function makeClient() {
  const httpLink = new createUploadLink({
      uri: "https://lottiefiles-backend-production.up.railway.app/graphql",
  });

  return new ApolloClient({
    cache,
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            authLink.concat(httpLink),
          ])
        : authLink.concat(httpLink),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    }
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}