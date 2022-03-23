import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  subtitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: Colors.gray,
    margin: '2%'
  },
  screenWidth: {
    width: '100%',
  },
  headerView: {
    paddingTop: responsiveHeight(3),
    height: 100,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2.2),
    color: Colors.white,
  },
  buttonStyle: {
    marginLeft: '5%',
  },
  actionsText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
  },
  headerColor: {
    color: 'white'
  },
  detailView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: responsiveHeight(15),
    width: responsiveWidth(25),
    resizeMode: 'contain',
    margin: '4%',
    marginTop: '10%',
  },
  titlePriceView: {
    marginTop: '10%',
  },
  borderRadius: {
    borderRadius: 20
  },
  itemTitle: {
    fontSize: responsiveFontSize(3),
    fontWeight: '200',
    color: Colors.black
  },
  itemPrice: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: Colors.blue,
    marginTop: '2%',
  },
  descriptionHeader: {
    marginLeft: '3%',
    fontWeight: 'bold',
  },
  gradientButton: {
    height: 50,
    justifyContent: 'center',
  },
  descriptionView: {
    justifyContent: 'center',
  },
  description: {
    color: Colors.gray,
    fontSize: responsiveFontSize(2),
    marginHorizontal: '4%',
    fontWeight: '200',
  },
  marginTwo: {
    margin: '2%',
  },
  cancelButton: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: Colors.smoothGray,
  },
  cancelText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '200',
    textAlign: 'center',
  },
  planDescription: {
    color: Colors.base,
    textAlign: 'center',
    fontWeight: '200',
    fontSize: responsiveFontSize(2.2)
  },
  restorePurchasesText: {
    color: Colors.base,
    textAlign: 'center',
    fontWeight: '300',
    fontSize: responsiveFontSize(2.1),
    margin: '4%'
  },
  webViewContainer: {
    flexDirection: 'row',
    marginHorizontal: '4%',
  },
  webviewText: {
    color: Colors.base,
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '200',
  },
  subscriptionDetail: {
    color: Colors.gray,
    fontSize: responsiveFontSize(1.5),
    marginHorizontal: '4%',
    fontWeight: '300',
  },
  seeOurText: {
    color: Colors.gray,
    fontSize: responsiveFontSize(1.5),
    fontWeight: '300',
  },
  separator: {
    borderBottomColor: Colors.gainsboro,
    borderBottomWidth: 1
  },
  subscriptionAgreement: {
    bottom: 0,
    marginVertical: '4%'
  },
  iStoreErrorContainer: {
    justifyContent: 'center'
  },
  spinnerView: {
    backgroundColor: 'white',
    width: '65%',
    height: '20%',
    alignSelf: 'center',
    borderRadius: 25,
    justifyContent: 'center'
  },
  restoreSpinnerText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    marginBottom: '15%',
    fontSize: 16
  }
});
