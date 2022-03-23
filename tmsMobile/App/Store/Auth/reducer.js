import LOGOUT from './action-types';

const initialState = {
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
