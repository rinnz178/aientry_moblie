import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import Button from './Button';
import CustomIcon from './Icon';
import Colors from '../../Themes';
import trans from '../../Translations/Trans';

const Camera = (props) => {
  const {
    onPress, camref, disabled, backPress, flashCapture, flashPress
  } = props;
  const flash = RNCamera.Constants.FlashMode;
  return (
    <View style={styles.container}>
      <RNCamera
        ref={camref}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={flashCapture ? flash.on : flash.off}
        androidCameraPermissionOptions={{
          title: trans('permissionCameraTitle'),
          message: trans('permissionCameraMessage'),
          buttonPositive: trans('ok'),
          buttonNegative: trans('cancel'),
        }}
        captureAudio={false}
      />
      <Button onPress={onPress} style={styles.capture} disabled={disabled}>
        <CustomIcon
          color={Colors.white}
          name="md-camera"
          size={50}
        />
      </Button>
      <Button onPress={backPress} style={styles.close}>
        <CustomIcon
          color={Colors.white}
          name="ios-close"
          size={responsiveWidth(12)}
        />
      </Button>
      <Button onPress={flashPress} style={styles.flash}>
        <CustomIcon
          color={Colors.white}
          name={flashCapture ? 'ios-flash' : 'ios-flash-off'}
          size={35}
        />
      </Button>
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.black
  },
  preview: {
    aspectRatio: 3 / 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10
  },
  close: {
    alignSelf: 'center',
    position: 'absolute',
    top: 40,
    left: 15
  },
  flash: {
    alignSelf: 'center',
    position: 'absolute',
    top: 40,
    right: 20
  },
});
