/* eslint-disable no-console */
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  DefaultOptions,
  ServerError,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import Router from "next/router";

let client: ApolloClient<NormalizedCacheObject> | null = null;

const httpLink = createUploadLink({
  uri: "/api/graphql",
  credentials: "same-origin",
});

const errorLink = onError(({ networkError }) => {
  if (networkError) {
    console.log(`[Network error]: ${networkError.message}`);
    const result = (networkError as ServerError).result as
      | ServerError["result"]
      | undefined;

    if (result?.message === "token expired") {
      void Router.push("/api/auth/logout");
    }
  }
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy(currentFetchPolicy) {
      if (
        currentFetchPolicy === "network-only" ||
        currentFetchPolicy === "cache-and-network"
      ) {
        return "cache-first";
      }

      return currentFetchPolicy;
    },
  },
};

export const getClient = (): ApolloClient<NormalizedCacheObject> => {
  if (!client || typeof window === "undefined") {
    client = new ApolloClient({
      link: errorLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions,
    });
  }

  return client;
};
