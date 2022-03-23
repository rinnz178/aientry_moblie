import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../../Themes';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1
  },
  formsWrapper: {
    flexDirection: 'row',
    width: '100%',
    flex: 2
  },
  animatedView: {
    marginTop: '10%',
  },
  formContainer: {
    paddingHorizontal: '5%'
  },
  grayText: {
    color: Colors.gray
  },
  passwordText: {
    color: Colors.base
  },
  submitButton: {
    marginTop: responsiveHeight(4),
    flex: 1,
    bottom: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    backgroundColor: Colors.base
  },
  logoStyle: {
    marginTop: responsiveHeight(10),
    width: responsiveWidth(50),
    resizeMode: 'contain',
    height: responsiveHeight(30),
    flex: 1
  },
  navigatorTextButton: {
    flexDirection: 'row',
    marginTop: '8%',
    alignSelf: 'center',
    height: responsiveHeight(4)
  },
  formWithHeader: {
    flex: 1,
    alignItems: 'center'
  },
  toastSuccess: {
    backgroundColor: 'rgba(6, 186, 39, 0.5)',
    width: '30%',
    height: '15%'
  },
  webviewText: {
    color: Colors.base,
    textDecorationLine: 'underline'
  },
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
    marginTop: '2%'
  },
  pdfStyle: {
    flex: 1,
  },
});
