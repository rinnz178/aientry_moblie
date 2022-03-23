import { combineReducers } from 'redux';
import subscriptionReducer from './SubscriptionStatus/reducer';
import productReducer from '../Containers/Upgrade/Store/reducer';
import userReducer from '../Containers/Dashboard/Store/reducer';
import authReducer from './Auth/reducer';
import kytReducer from '../Containers/KYT/Store/reducer';
import locationReducer from '../Services/Geolocation/Store/reducer';

export default combineReducers({
  subscriptions: subscriptionReducer,
  product: productReducer,
  user: userReducer,
  kyt: kytReducer,
  auth: authReducer,
  userLocation: locationReducer
});
