import { StyleSheet } from 'react-native';
import {
} from 'react-native-responsive-dimensions';
import GalleryStyle from './DeviceImageGalleryStyle';

export default StyleSheet.create({
  ...GalleryStyle,
  albumButton: {
    flex: 1 / 2,
    margin: '2%',
  },
  siteThumbnailStyle: {
    aspectRatio: 4 / 3,
  },
  siteNameStyle: {
    marginTop: '4%',
    textAlign: 'center',
  },
});
