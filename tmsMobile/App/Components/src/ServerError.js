import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import trans from '../../Translations/Trans';
import Button from './Button';
import CustomIcon from './Icon';
import Colors from '../../Themes';

const ServerError = (props) => {
  const { serverError, onPress } = props;
  return (
    serverError
      && (
        <Button onPress={onPress} style={styles.offlineContainer}>
          <CustomIcon name="cloud-off" size={100} icon="feathericons" />
          <Text style={styles.offlineText}>{trans('serverError')}</Text>
          <View style={styles.flexRow}>
            <CustomIcon name="ios-refresh" size={15} />
            <Text style={styles.offlineText}>
              {trans('retry')}
            </Text>
          </View>
        </Button>
      )
  );
};

export default ServerError;

const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray
  },
  offlineText: { color: Colors.black },
  touchableOpacityStyle: {
    borderWidth: 1,
    borderColor: Colors.base,
    height: responsiveHeight(6),
    width: responsiveWidth(40),
    backgroundColor: Colors.base
  },
  centerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetTextStyle: {
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    color: Colors.white
  },
  flexRow: {
    flexDirection: 'row'
  }
});
