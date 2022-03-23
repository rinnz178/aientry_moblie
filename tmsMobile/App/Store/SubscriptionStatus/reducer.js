import SUBSCRIPTION_STATUS from './action-types';
import LOGOUT from '../Auth/action-types';

const initialState = {
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBSCRIPTION_STATUS:
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
