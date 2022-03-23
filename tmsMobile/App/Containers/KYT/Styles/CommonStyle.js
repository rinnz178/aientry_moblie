import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../../Themes';

export default StyleSheet.create({
  container: {
    flex: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.lightGray
  },
  sectionHeader: {
    marginTop: '6%',
    paddingLeft: '3%',
    paddingRight: '3%',
    fontSize: responsiveFontSize(2),
    color: Colors.black,
    fontWeight: 'bold'
  },
  buttonStyle: {
    backgroundColor: Colors.white,
    height: responsiveHeight(8),
    justifyContent: 'center'
  },
  view: {
    marginTop: '10%',
  },
  listItemStyle: {
    padding: 5
  },
  serverErrorIcon: {
    height: responsiveHeight(25),
    width: responsiveWidth(40),
    marginTop: responsiveHeight(10)
  },
  promotionalBtn: {
    borderWidth: 1,
    borderColor: Colors.base,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: responsiveHeight(4),
    height: responsiveHeight(5),
    paddingHorizontal: '5%'
  },
  footerBottomContainer: {
    // borderTopWidth: 2,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    bottom: 0,
    marginTop: 20,
    height: responsiveHeight(10),
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabled: {
    opacity: 0.4,
  },
  footerButton: {
    backgroundColor: Colors.base,
    height: responsiveHeight(8),
    width: '96%',
    justifyContent: 'center',
    borderRadius: 5
  },
  footerButtonText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: responsiveFontSize(2.5)
  }
});
