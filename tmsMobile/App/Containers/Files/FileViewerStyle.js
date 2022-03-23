import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import Colors from '../../Themes';

export default StyleSheet.create({
  container: {
    flex: 1,
    borderColor: Colors.lightGray
  },
  view: {
    marginTop: '10%',
  },
  sectionHeader: {
    paddingHorizontal: '5%',
    paddingTop: '7%',
    fontSize: responsiveFontSize(2.2),
    color: Colors.gray
  },
  listItemStyle: {
    padding: 5
  },
  modalStyle: {
    justifyContent: 'flex-end'
  },
  closeText: {
    color: Colors.red,
    fontSize: responsiveFontSize(2)
  },
  viewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewClose: {
    height: responsiveHeight(5),
    flexDirection: 'row',
    width: '100%',
    marginTop: '3%',
    marginRight: '10%',
    justifyContent: 'flex-end'
  },
  webviewStyle: {
    flex: 1,
    marginTop: '2%'
  },
  width: {
    width: '100%'
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.lightGray
  }
});
