import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes';

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  workDetail: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingBottom: '10%',
    height: '100%'
  },
  svContainer: {
    minHeight: '100%',
    alignItems: 'center',
    marginTop: 0
  },
  statusBaseStyle: {
    borderWidth: 5,
    borderColor: Colors.white
  },
  statusLogin: {
    backgroundColor: Colors.green
  },
  statusLogout: {
    backgroundColor: Colors.red
  },
  avatarPlaceHolder: {
    width: '100%',
    height: '100%'
  },
  avatarStyle: {
    borderWidth: 6,
    borderColor: Colors.white
  },
  name: {
    marginTop: '3%',
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: Colors.white
  },
  avatarContainer: {
    paddingTop: '10%',
    flex: 1,
    alignItems: 'center'
  },
  moreIcon: {
    color: Colors.white,
    paddingTop: '5%'
  },
  moreText: {
    marginTop: '-3%',
    marginBottom: '5%',
    fontSize: responsiveFontSize(1.7),
    color: Colors.white
  },
  gradientWrapper: {
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  modalStyle: {
    justifyContent: 'flex-end'
  },
  headerButtonsWrapper: {
    paddingTop: responsiveHeight(8),
    position: 'absolute',
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  recognitionIconButton: {
    position: 'absolute',
    left: 0,
    top: responsiveHeight(6)
  },
  recognitionIcon: {
    width: responsiveWidth(11),
    height: responsiveHeight(8),
  },
  linearGradientWrapper: {
    backgroundColor: Colors.white
  },
  btnView: {
    flexDirection: 'row',
    flex: 1,
    marginTop: '5%'
  },
  attendanceBtnWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  attendanceBtn: {
    backgroundColor: Colors.green,
    justifyContent: 'center',
    width: '60%',
    height: 50,
    borderRadius: 10
  },
  attendanceBtnText: {
    textAlign: 'center',
    color: 'white',
  },
  checkIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkIcon: {
    width: responsiveWidth(15),
    resizeMode: 'contain',
    height: responsiveHeight(15),
  }
});
