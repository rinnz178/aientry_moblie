import React from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { CustomIcon } from '../../../Components';
import Colors from '../../../Themes';

const EllipsisText = (props) => {
  const { customStyle, numOfLines, children } = props;
  return (
    <Text
      numberOfLines={numOfLines || 1}
      ellipsizeMode="tail"
      style={customStyle}
    >
      { children }
    </Text>
  );
};


const UpgradeList = (props) => {
  const {
    containerStyle, onPress, source, data,
  } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, containerStyle]}>
        <FastImage
          style={[styles.image, styles.borderRadius]}
          source={source}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.textRow}>
          <EllipsisText customStyle={styles.itemTitle}>{data.title}</EllipsisText>
          <EllipsisText customStyle={styles.itemPrice}>
            {`${data.price} ${data.currency}`}
          </EllipsisText>
          <EllipsisText numOfLines={2} customStyle={styles.itemDescription}>
            {data.description}
          </EllipsisText>
        </View>
        <View style={styles.iconView}>
          <CustomIcon
            name="ios-arrow-forward"
            onPress={onPress}
            color={Colors.gainsboro}
            size={responsiveHeight(4)}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UpgradeList;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: '2%',
    paddingBottom: '5%',
    marginVertical: responsiveHeight(1),
  },
  itemTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '300',
    color: Colors.black
  },
  itemDescription: {
    fontSize: responsiveFontSize(1.5),
    color: Colors.gray
  },
  textRow: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: '3%',
    marginRight: '5%',
    justifyContent: 'center'
  },
  image: {
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    alignSelf: 'center',
  },
  itemPrice: {
    fontSize: responsiveFontSize(2),
    fontWeight: '300',
    color: Colors.blue
  },
  iconView: {
    alignContent: 'center',
    alignSelf: 'center',
    marginRight: '3%'
  }
});
