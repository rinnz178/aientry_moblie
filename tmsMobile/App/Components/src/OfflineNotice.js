import React from 'react';
import {
  Text, SafeAreaView, Dimensions, StyleSheet
} from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import trans from '../../Translations/Trans';
import Colors from '../../Themes';

const OfflineNotice = (props) => {
  const { hasConnection } = props;
  return (
    !hasConnection
      && (
        <SafeAreaView style={styles.offlineContainer}>
          <Text style={styles.offlineText}>{trans('noConnection')}</Text>
        </SafeAreaView>
      )
  );
};

export default OfflineNotice;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: Colors.red,
    justifyContent: 'center',
    paddingTop: responsiveHeight(4),
    alignItems: 'center',
    width
  },
  offlineText: { color: Colors.white }
});
