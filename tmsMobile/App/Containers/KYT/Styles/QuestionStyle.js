import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../../../Themes';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    alignItems: 'center'
  },
  listContainer: {
    flex: 1,
    width: '100%'
  },
  renderSeparatorStyle: {
    width: '90%',
    alignSelf: 'center',
    borderBottomColor: Colors.gainsboro
  },
  cardContainer: {
    width: '98%',
    alignSelf: 'center',
    padding: 5,
    margin: '1%',
    backgroundColor: Colors.white
  },

  footerBottomContainer: {
    borderTopWidth: 2,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    bottom: 0,
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
