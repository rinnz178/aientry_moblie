import { StyleSheet } from 'react-native';
import {
} from 'react-native-responsive-dimensions';
import GalleryStyle from './DeviceImageGalleryStyle';

export default StyleSheet.create({
  ...GalleryStyle,
  imageButton: {
    flex: 1 / 3,
    margin: 0.5
  },
  imageHeight: {
    height: 150
  },
  bottomTabBackground: {
    alignItems: 'center',
    bottom: 0,
    width: '100%',
    backgroundColor: '#d4d4d4',
    height: 50,
    flexDirection: 'row',
  },
  selectButton: {
    left: '8%',
    position: 'absolute'
  },
  deleteButtonIcon: {
    right: '8%',
    position: 'absolute'
  }
});
