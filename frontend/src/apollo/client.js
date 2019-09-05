import ApolloClient from "apollo-boost"
import fetch from "isomorphic-fetch"
import { endpoint } from "../config"

export const client = new ApolloClient({
  uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
  request: operation => {
    operation.setContext({
      fetchOptions: {
        credentials: "same-origin",
      },
    })
  },
  fetch,
})
