import { USER_PROFILE, USER_ATTENDANCE } from './action-types';

export const setUserProfile = payload => ({
  type: USER_PROFILE,
  payload
});

export const setUserAttendance = payload => ({
  type: USER_ATTENDANCE,
  payload
});
