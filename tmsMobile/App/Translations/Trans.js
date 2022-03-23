import { NativeModules, Platform } from 'react-native';
import ja from './ja';
import en from './en';

const deviceLanguage = Platform.OS === 'ios'
  ? NativeModules.SettingsManager.settings.AppleLocale
    || NativeModules.SettingsManager.settings.AppleLanguages[0]
  : NativeModules.I18nManager.localeIdentifier;

let locale = 'en'; // default language

if (deviceLanguage.slice(0, 2) === 'ja') {
  locale = 'ja';
}

const translations = {
  en,
  ja,
};

export default function trans(key) {
  const translation = translations[locale][key];
  return (typeof translation !== 'undefined') ? translation : key;
}
