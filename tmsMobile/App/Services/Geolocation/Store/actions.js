import USER_LOCATION from './action-types';

const setUserLocation = payload => ({
  type: USER_LOCATION,
  payload
});

export default setUserLocation;
