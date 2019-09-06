/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import React from "react"
import { ApolloProvider } from "react-apollo"
import { client } from "./src/apollo/client"
import Page from "./src/components/Page"

export const wrapRootElement = ({ element }) => (
  <Page>
    <ApolloProvider client={client}>{element}</ApolloProvider>
  </Page>
)
