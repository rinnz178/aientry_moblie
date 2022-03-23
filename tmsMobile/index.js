/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

console.disableYellowBox = true; // eslint-disable-line
AppRegistry.registerComponent(appName, () => App);
