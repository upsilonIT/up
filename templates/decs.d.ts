import type {
  ApolloError as ApolloOriginalError,
  GraphQLError,
} from "@apollo/client";

export type ApolloErrorCustom = {
  graphQLErrors: GraphQLError;
} & ApolloOriginalError;
