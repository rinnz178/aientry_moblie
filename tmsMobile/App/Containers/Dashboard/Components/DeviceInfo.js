import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../../Themes';
import { Button } from '../../../Components';
import trans from '../../../Translations/Trans';

const DeviceID = (props) => {
  const { UniqueID, onPress } = props;
  let uuid = `${trans('id')}: ${UniqueID}`;
  if (UniqueID === '') {
    uuid = trans('copied');
  }
  return (
    <Button onPress={onPress} style={[styles.subContainer, styles.container]}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.gray, styles.textID]}
      >
        {uuid}
      </Text>
      {
        UniqueID !== ''
        && (
          <View style={{ position: 'absolute', right: 10 }}>
            <Icon
              name="md-copy"
              type="ionicon"
              color={Colors.gray}
              size={23}
            />
          </View>
        )
      }
    </Button>
  );
};

export default DeviceID;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
    marginTop: 20,
    borderRadius: 15,
    padding: 23,
    width: responsiveWidth(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gray: {
    color: Colors.gray
  },
  name: {
    fontSize: 25,
  },
  textID: {
    fontSize: responsiveFontSize(1.5),
    paddingRight: 2
  }
});
