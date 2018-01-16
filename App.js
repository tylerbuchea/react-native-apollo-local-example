import React from 'react';
import { SafeAreaView } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

import resolvers from './src/resolvers';
import Home from './src/Home';

const client = new ApolloClient({
  link: withClientState({ resolvers }),
  cache: new InMemoryCache(),
});

export default class App extends React.Component {
  render() {
    return(
      <ApolloProvider client={client}>
        <SafeAreaView>
          <Home />
        </SafeAreaView>
      </ApolloProvider>
    )
  }
}