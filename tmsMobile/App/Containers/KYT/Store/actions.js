import { KYT_ANSWERS, KYT_CATEGORIES } from './action-types';

export const setKYTAnswer = payload => ({
  type: KYT_ANSWERS,
  payload
});

export const setKYTCategory = payload => ({
  type: KYT_CATEGORIES,
  payload
});
