import React from 'react';
import {
  FlatList, View, Text, StyleSheet
} from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { Icon } from 'react-native-elements';
import { Modal, ModalContainer, GradientButton } from '../../../Components';
import Colors from '../../../Themes';
import trans from '../../../Translations/Trans';

const UserData = (props) => {
  const { data, visible, onPress } = props;
  const UserInfoItems = [
    {
      id: 1,
      icon: 'md-mail',
      info: data.email,
    },
    {
      id: 2,
      icon: 'md-briefcase',
      info: data.company_name
    },
    {
      id: 3,
      icon: 'ios-locate',
      info: data.address_one,
    },
    {
      id: 4,
      icon: 'ios-call',
      info: data.phone_number
    }
  ];
  return (
    <Modal
      customStyle={styles.modalStyle}
      visible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <ModalContainer style={styles.container} height="50%">
        <View style={styles.profileContainer}>
          <FlatList
            scrollEnabled={false}
            data={UserInfoItems}
            renderItem={({ item }) => (
              <View style={[styles.dataRowWrapper]}>
                <Icon
                  name={item.icon}
                  type="ionicon"
                  color={Colors.placeHolderIcon}
                  size={25}
                  style={styles.icon}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.textInfo}
                >
                  {item.info}
                </Text>
              </View>
            )}
            keyExtractor={item => item.icon}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <GradientButton
            title={trans('ok')}
            onPress={onPress}
            customStyle={styles.button}
          />
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default UserData;

const styles = StyleSheet.create({
  modalStyle: {
    width: '100%',
    justifyContent: 'flex-end'
  },
  container: {
    width: '100%',
    padding: '3%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderRadius: 20
  },
  profileContainer: {
    flex: 3
  },
  dataRowWrapper: {
    flexDirection: 'row',
    minWidth: '100%',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '2%',
    paddingBottom: '2%'
  },
  textInfo: {
    fontSize: responsiveFontSize(1.8),
    marginLeft: 20
  },
  buttonWrapper: {
    width: '90%',
  },
  button: {
    height: responsiveHeight(9),
    borderRadius: 10,
    justifyContent: 'center'
  }
});
