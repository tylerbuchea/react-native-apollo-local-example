import { Constants, Location, Permissions } from 'expo';

export const getCurrentPosition = async options => {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') throw status;
  const location = await Location.getCurrentPositionAsync({});
  return location;
};

const resolvers = {
  Query: {
    currentPosition: async (_, { enableHighAccuracy, timeout, maximumAge }) => {
      try {
        const { coords, timestamp } = await getCurrentPosition({
          enableHighAccuracy,
          timeout,
          maximumAge,
        });

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

export default resolvers;