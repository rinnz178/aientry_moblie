import React, { PureComponent } from 'react';
import {
  View, StyleSheet, Text, Image, SafeAreaView
} from 'react-native';
import Config from 'react-native-config';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Storage } from '../../Services';
import { StatusBar, CustomIcon } from '../../Components';
import Colors from '../../Themes';
import trans from '../../Translations/Trans';
import LoginImage from '../../Images/guide_login.png';
import AttendanceImage from '../../Images/guide_attendance.png';
import DownloadImage from '../../Images/guide_download.png';
import KYTimage from '../../Images/guide_kyt.png';

const slides = [
  {
    key: '1',
    header: trans('guideLoginHeader'),
    description: trans('guideLoginDesc'),
    image: LoginImage,
  },
  {
    key: '2',
    header: trans('guideAttendanceHeader'),
    description: trans('guideAttendanceDesc'),
    image: AttendanceImage,
  },
  {
    key: '3',
    header: trans('guideKYTHeader'),
    description: trans('guideKYTDesc'),
    image: KYTimage,
  },
  {
    key: '4',
    header: trans('guideDownloadHeader'),
    description: trans('guideDownloadDesc'),
    image: DownloadImage,
  },
];

export default class UserGuide extends PureComponent {
  _renderItem = ({ item }) => (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.imageBackground}>
        <Image source={item.image} style={styles.imageStyle} />
      </View>
      <Text style={styles.header}>{item.header}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </SafeAreaView>
  )

  _onDone = async () => {
    await Storage.storeData(Config.USER_GUIDE, '1');
    const { hideGuide, navigation } = this.props;
    if (navigation) {
      navigation.goBack(); // will go back to Dashboard screen
    }
    hideGuide(true); // will render the login screen
  }

  _renderNextButton = () => (
    <View style={styles.buttonCircle}>
      <CustomIcon
        name="md-arrow-round-forward"
        color="rgba(255, 255, 255, .9)"
        size={24}
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );

  _renderDoneButton = () => (
    <View style={styles.buttonCircle}>
      <CustomIcon
        name="md-checkmark"
        color="rgba(255, 255, 255, .9)"
        size={24}
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );

  render() {
    return (
      <AppIntroSlider
        renderItem={this._renderItem}
        slides={slides}
        buttonTextStyle={styles.buttonTextStyle}
        prevLabel={trans('back')}
        nextLabel={trans('next')}
        doneLabel={trans('done')}
        showPrevButton
        dotStyle={styles.inActiveDotStyle}
        activeDotStyle={styles.activeDotStyle}
        onDone={this._onDone}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexGrow: 1,
    alignItems: 'center',
    marginTop: responsiveHeight(10)
  },
  imageBackground: {
    backgroundColor: Colors.lightGray,
    width: responsiveWidth(40),
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(40) / 2,
    marginBottom: responsiveHeight(5)
  },
  imageStyle: {
    width: responsiveWidth(25),
    resizeMode: 'contain',
    height: responsiveHeight(15)
  },
  header: {
    fontSize: responsiveFontSize(2.5),
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    marginHorizontal: 20
  },
  /* Intro Slider styles */
  buttonTextStyle: {
    color: 'gray',
    fontSize: responsiveFontSize(1.8)
  },
  inActiveDotStyle: {
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  activeDotStyle: {
    backgroundColor: Colors.base
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 320,
    height: 320,
  },
});
