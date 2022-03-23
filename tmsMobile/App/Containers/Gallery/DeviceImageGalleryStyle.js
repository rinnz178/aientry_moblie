import { StyleSheet } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Colors from '../../Themes';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
    borderBottomColor: Colors.lightGray,
    alignItems: 'center',
    height: responsiveHeight(55),
  },
  screenWidth: {
    width: '100%',
  },
  screenHeight: {
    height: '100%',
  },
  header: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2.2),
    color: Colors.white,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: responsiveHeight(3),
    height: 100,
  },
  actionsText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
  },
  buttonStyle: {
    flex: 1,
    textAlign: 'right',
    justifyContent: 'center'
  },
  gainsboro: {
    color: Colors.white,
  },
  thumbnailContainer: {
    flex: 1 / 3,
    margin: 0.5
  },
  imageThumbnail: {
    flex: 1,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    flex: 1,
    marginTop: responsiveHeight(7),
  },
  uploadButton: {
    width: '100%',
  },
  backButtonContainer: {
    flex: 1
  },
  headerColor: {
    color: 'white'
  },
  headerTitleContainer: {
    flex: 2
  },
  viewFailedImages: {
    paddingLeft: 5,
  },
  failedImages: {
    height: 150,
    width: 100,
    marginBottom: 5
  },
  upgradeButton: {
    height: responsiveHeight(5),
    width: responsiveWidth(80),
    borderRadius: 5,
    justifyContent: 'center',
  },
  gradientButtonContainer: {
    margin: '1%',
  },
});
