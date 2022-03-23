import { PureComponent } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

class Storage extends PureComponent {
  storeData = async (storageKey, data) => {
    try {
      await AsyncStorage.setItem(storageKey, data);
    } catch (error) {
      // something went wrong
    }
  }

  getData = async (storageKey) => {
    try {
      const token = await AsyncStorage.getItem(storageKey);
      if (token !== null) {
        return token;
      }
    } catch (error) {
      // something went wrong
    }
    return null;
  }

  removeData = async (storageKey) => {
    try {
      await AsyncStorage.removeItem(storageKey);
    } catch (error) {
      // something went wrong
    }
  }
}

const storage = new Storage();

export default storage;
