import { KYT_ANSWERS, KYT_CATEGORIES } from './action-types';
import LOGOUT from '../../../Store/Auth/action-types';

const initialState = {
  sets: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case KYT_ANSWERS:
      return {
        ...state,
        sets: action.payload
      };
    case KYT_CATEGORIES:
      return {
        ...state,
        data: action.payload
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
