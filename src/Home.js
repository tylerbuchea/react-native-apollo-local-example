import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { View, Text, TouchableOpacity } from 'react-native';

export class Home extends React.Component {
  render() {
    const { showCoords, loading, refetch, currentPosition } = this.props;

    return (
      <View style={{ padding: 10 }}>
        <Text>Where am I currently located?</Text>
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
  }
}

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

export default graphql(GET_CURRENT_POSITION, {
  options: { notifyOnNetworkStatusChange: true },
  props: ({ ownProps, data: { loading, refetch, currentPosition } }) => ({
    ...ownProps,
    loading,
    refetch,
    currentPosition,
  }),
})(Home);