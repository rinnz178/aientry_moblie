import USER_LOCATION from './action-types';
import LOGOUT from '../../../Store/Auth/action-types';

const initialState = {
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOCATION:
      return {
        ...state,
        ...action.payload
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
