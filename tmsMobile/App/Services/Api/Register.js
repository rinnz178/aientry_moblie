import { NativeModules, Platform } from 'react-native';
import api from './Api';

export function CheckEmail(data) {
  const body = {
    email: data.email,
    password: data.password,
    password_confirmation: data.confirmPassword
  };
  return new Promise((resolve, reject) => {
    api('/api/check-email', 'POST', false, body)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

export function Register(data) {
  const deviceLanguage = Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale
  || NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier;

  let locale = 'EN'; // default language

  if (deviceLanguage.slice(0, 2) === 'ja') {
    locale = 'JP';
  }
  const body = {
    email: data.email,
    name: data.companyName,
    phone_number: data.companyContactNum,
    first_name: data.firstName,
    last_name: data.lastName,
    password: data.password,
    password_confirmation: data.confirmPassword,
    zip_code: data.zipCode,
    address_one: data.companyAddress1,
    address_two: data.companyAddress2 || '',
    plan_id: 1,
    lang: locale,
  };
  return new Promise((resolve, reject) => {
    api('/api/company-signup', 'POST', false, body)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
