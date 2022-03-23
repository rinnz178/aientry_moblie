import { USER_PROFILE, USER_ATTENDANCE } from './action-types';
import LOGOUT from '../../../Store/Auth/action-types';

const initialState = {
  user: {},
  userAttendance: {
    siteId: 0,
    isLoggedIn: false,
    timeIn: null,
    timeOut: null,
    timeDiff: null,
    remarks: '-',
    action: 'out',
    latestAttendance: null,
    currentLocation: null,
    isWithinRadius: false,
    scheduleStartTime: null
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_PROFILE:
      return {
        ...state,
        user: action.payload
      };
    case USER_ATTENDANCE:
      return {
        ...state,
        userAttendance: action.payload
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
