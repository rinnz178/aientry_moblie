import React from 'react';
import {
  StyleSheet, View, FlatList, Text
} from 'react-native';
import { CustomIcon, Button, Separator } from '../../../Components';
import Colors from '../../../Themes/Colors';
import trans from '../../../Translations/Trans';

const FailedUpload = (props) => {
  const {
    reupload, close, data, renderItem, keyExtractor
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button onPress={reupload} style={styles.refreshIcon}>
          <CustomIcon
            name="ios-refresh"
            color={Colors.base}
          />
          <Text style={styles.refreshText}>{trans('retryUpload')}</Text>
        </Button>
        <Button onPress={close} style={styles.closeIcon}>
          <CustomIcon
            name="ios-close-circle"
            color={Colors.base}
          />
        </Button>
      </View>
      <Separator customStyle={styles.separator} />
      <View style={styles.flatlist}>
        <FlatList
          data={data}
          horizontal
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
    </View>
  );
};

export default FailedUpload;

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    width: '100%',
    backgroundColor: Colors.aliceBlue,
  },
  buttons: {
    flex: 1,
  },
  flatlist: {
    flex: 1,
    marginTop: '1%'
  },
  refreshIcon: {
    left: 10,
    top: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  refreshText: {
    textAlign: 'center',
    marginLeft: '5%',
    color: Colors.base,
  },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  separator: {
    borderBottomColor: Colors.gainsboro,
    borderBottomWidth: 1,
    width: '95%',
    alignSelf: 'center',
    marginTop: '2%'
  },
});
