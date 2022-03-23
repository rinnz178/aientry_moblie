import { VIEWED_PRODUCT, PRODUCT_IDENTIFIER, PRODUCT_LIST } from './action-types';

export const setViewedProduct = payload => ({
  type: VIEWED_PRODUCT,
  payload
});

export const setProductId = payload => ({
  type: PRODUCT_IDENTIFIER,
  payload
});

export const setProductList = payload => ({
  type: PRODUCT_LIST,
  payload
});
