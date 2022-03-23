import React from 'react';
import {
  View, Text, Modal, StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import Colors from '../../../Themes';
import trans from '../../../Translations/Trans';

const ClipBoardNotification = (props) => {
  const { modalVisible } = props;
  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.contentStyle}>
          <Icon
            name="ios-checkmark"
            type="ionicon"
            color={Colors.white}
            size={40}
          />
          <Text style={styles.textStyle}>{trans('copied')}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default ClipBoardNotification;

const styles = StyleSheet.create({
  contentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  contentStyle: {
    borderRadius: 15,
    alignContent: 'center',
    justifyContent: 'center',
    minHeight: '15%',
    minWidth: '25%',
    backgroundColor: Colors.copiedNotification,
  },
  textStyle: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 18
  }
});
