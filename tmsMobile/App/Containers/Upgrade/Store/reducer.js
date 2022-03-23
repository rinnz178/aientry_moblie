import { VIEWED_PRODUCT, PRODUCT_IDENTIFIER, PRODUCT_LIST } from './action-types';
import LOGOUT from '../../../Store/Auth/action-types';

const initialState = {
  viewed_product: null,
  product_identifier: [],
  product_list: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case VIEWED_PRODUCT:
      return {
        ...state,
        viewed_product: action.payload
      };
    case PRODUCT_IDENTIFIER:
      return {
        ...state,
        product_identifier: action.payload
      };
    case PRODUCT_LIST:
      return {
        ...state,
        product_list: action.payload
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
