import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import Pdf from 'react-native-pdf';
import Modal from './Modal';
import ModalContainer from './ModalContainer';
import Separator from './Separator';
import Button from './Button';
import Colors from '../../Themes';
import trans from '../../Translations/Trans';

const PdfViewer = (props) => {
  const {
    visible, onBackButtonPress, onBackdropPress,
    onSwipeComplete, onPress, source
  } = props;
  return (
    <Modal
      customStyle={styles.modalStyle}
      visible={visible}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={onBackdropPress}
      onSwipeComplete={onSwipeComplete}
    >
      <ModalContainer height="95%">
        <View style={styles.viewClose}>
          <Button onPress={onPress}>
            <Text style={styles.closeText}>{trans('close')}</Text>
          </Button>
        </View>
        <Separator customStyle={styles.width} />
        <View style={[styles.webviewStyle, styles.width]}>
          <Pdf
            source={source}
            style={styles.pdfStyle}
          />
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default PdfViewer;

const styles = StyleSheet.create({
  modalStyle: {
    justifyContent: 'flex-end'
  },
  viewClose: {
    height: responsiveHeight(5),
    flexDirection: 'row',
    width: '100%',
    marginTop: '3%',
    marginRight: '10%',
    justifyContent: 'flex-end'
  },
  closeText: {
    color: Colors.red,
    fontSize: responsiveFontSize(2)
  },
  width: {
    width: '100%'
  },
  webviewStyle: {
    flex: 1,
  },
  pdfStyle: {
    flex: 1,
  },
});
