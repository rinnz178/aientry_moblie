import Api from './Api/Api';
import {
  files, siteNames, siteImages, deleteImages
} from './Api/Files';
import { attendance, attendanceWithFaceRecognition } from './Api/AttendanceApi';
import {
  sets, questions, categories, answerKYT, hasAnsweredQuestion,
  postQuestion
} from './Api/KYT';
import Logout from './Api/Logout';
import FetchOauth from './Api/Oauth';
import reset from './Api/Reset';
import profile from './Api/User';
import GeoLocationManager from './Geolocation/GeoLocationManager';
import ConnectionManager from './Connection/ConnectionManager';
import { setReminder } from './Notification/FirebaseNotification';
import Storage from './LocalStorage/Storage';
import uploadImage from './Api/UploadImage';
import { getProducts, validateReceipt } from './Api/GetProducts';
import ZipCode from './Api/ZipCode';
import { Register, CheckEmail } from './Api/Register';
import ResendVerification from './Api/ResendVerification';
import getSubscription from './Api/GetSubscriptions';

export {
  Api,
  attendance,
  attendanceWithFaceRecognition,
  files,
  sets,
  questions,
  categories,
  Logout,
  FetchOauth,
  reset,
  profile,
  ConnectionManager,
  GeoLocationManager,
  setReminder,
  Storage,
  answerKYT,
  hasAnsweredQuestion,
  postQuestion,
  siteNames,
  siteImages,
  deleteImages,
  uploadImage,
  getProducts,
  validateReceipt,
  ZipCode,
  Register,
  CheckEmail,
  ResendVerification,
  getSubscription,
};
