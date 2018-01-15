import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { Constants, Location, Permissions } from 'expo';

export class App extends React.Component {
  state = {
    showCoords: false,
  };

  getCoords = e => {
    this.setState(state => ({ showCoords: true }));
  };

  render() {
    const { showCoords } = this.state;

    return (
      <View style={{ padding: 10 }}>
        <Text>Where am I currently located?</Text>
        {!showCoords && <TouchableOpacity onPress={this.getCoords}><Text>Find out!</Text></TouchableOpacity>}
        {showCoords && <Coordinates showCoords={showCoords} timeout={15000} />}
      </View>
    );
  }
}

const getCurrentPosition = async options => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    throw status;
  }
  let location = await Location.getCurrentPositionAsync({});
  return location;
};

export const resolvers = {
  Query: {
    currentPosition: async (_, { enableHighAccuracy, timeout, maximumAge }) => {
      try {
        const data = await getCurrentPosition({
          enableHighAccuracy,
          timeout,
          maximumAge,
        });

        /*
        The object returned from getCurrentPosition has read only properties.
        Copying read-only properties is blocked by Object.assign.
        Copying read-only properties is not blocked by the spread operator (according to the spec),
        Since Babel compiles the spread operator to Object.assign, we can't use it here until the transform is spec-compliant.
        https://github.com/babel/babel/pull/7034
        */

        const { coords, timestamp } = data;
        return {
          coords: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            altitude: coords.altitude,
            accuracy: coords.accuracy,
            __typename: 'Coordinates',
          },
          timestamp,
          __typename: 'CurrentPosition',
          id: timestamp,
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    },
  },
};

const GET_CURRENT_POSITION = gql`
  query getCurrentPosition($timeout: Int) {
    currentPosition(timeout: $timeout) @client {
      coords {
        latitude
        longitude
      }
    }
  }
`;

const CoordinatesDumb = ({ showCoords, loading, refetch, currentPosition }) => (
  <View>
    {!currentPosition ? (
      loading ? (
        <Text>Loading...</Text>
      ) : (
        <Text>
          Error: Unable to fetch your current position. Are you using a browser
          that supports the Geolocation API?
        </Text>
      )
    ) : (
      <View style={{ opacity: loading ? 0.5 : 1 }}>
        <Text>{`Latitude: ${currentPosition.coords.latitude}`}</Text>
        <Text>{`Longitude: ${currentPosition.coords.longitude}`}</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text>Refresh!</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

export const Coordinates = graphql(GET_CURRENT_POSITION, {
  options: { notifyOnNetworkStatusChange: true },
  props: ({ ownProps, data: { loading, refetch, currentPosition } }) => ({
    ...ownProps,
    loading,
    refetch,
    currentPosition,
  }),
})(CoordinatesDumb);

const client = new ApolloClient({
  link: withClientState({ resolvers }),
  cache: new InMemoryCache(),
});

export default class Root extends React.Component {
  render() {
    return(
      <ApolloProvider client={client}>
        <SafeAreaView>
          <App />
        </SafeAreaView>
      </ApolloProvider>
    )
  }
}