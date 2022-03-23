import React, { PureComponent } from 'react';
import {
  View, Text, Platform, Linking,
  SafeAreaView,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import ActionSheet from 'react-native-actionsheet';
import Config from 'react-native-config';
import * as RNIap from 'react-native-iap';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import setSubscriptionStatus from '../../Store/SubscriptionStatus/actions';
import styles from './UpgradeStyle';
import {
  Button, GradientButton, CustomDialog, OverlayLoader,
  Separator, PdfViewer, StatusBar, Modal, Spinner
} from '../../Components';
import trans from '../../Translations/Trans';
import { validateReceipt } from '../../Services';
import infoIcon from '../../Images/icon_info.png';
import getUserSubscription from '../../Utils/SubscriptionStatus';
import Colors from '../../Themes';

const confirmationArray = [
  trans('yes'),
  trans('cancel'),
];

class Details extends PureComponent {
  purchaseUpdateSubscription = null;

  purchaseErrorSubscription = null;

  constructor(props) {
    super(props);
    this.state = {
      showSpinner: false,
      showDialog: false,
      isRestoringPurchases: false,
      webviewVisible: false,
      url: '',
    };
    this.purchaseItem = this.purchaseItem.bind(this);
    this.restorePurchases = this.restorePurchases.bind(this);
  }

  async componentDidMount() {
    const vm = this;
    const userSubscription = await getUserSubscription();
    vm.props.setSubscriptionStatus(userSubscription);
    this.purchaseListener();
  }

  componentWillUnmount() {
    this.removeSubscription();
  }

  showPurchaseDialog = () => {
    this.confirmPurchase.show();
  }

  showWebModal = (url) => {
    const { webviewVisible } = this.state;
    this.setState({
      webviewVisible: !webviewVisible,
      url,
    });
  }

  /**
   * Create (buy) a subscription to a sku.
   *
   * @return void
   */
  purchaseItem = async () => {
    const { viewedProduct } = this.props;
    const vm = this;
    try {
      // show spinner
      vm.setState({ showSpinner: true });
      await RNIap.requestSubscription(viewedProduct.productId, false);
    } catch (error) {
      Platform.OS === 'ios' && await RNIap.clearTransactionIOS();
      vm.setState({ showSpinner: false });
    }
  }

  /**
   * Checks the active purchases of the Play Store / App Store account, and will
   * restore all the active plan(s).
   *
   * @return void
   */
  restorePurchases = async () => {
    this.setState({ isRestoringPurchases: true });
    RNIap.initConnection()
      .then(
        await RNIap.getAvailablePurchases().then((purchases) => {
          const { productId } = this.props;
          if (purchases.length < 1) { // if no purchases yet
            this.setState({ isRestoringPurchases: false });
            return;
          }
          productId.forEach((sku) => {
            const prodId = sku.product_identifier.concat(Platform.OS === 'ios' ? '.iosjp' : '');
            const receipt = purchases.find(x => x.productId === prodId);
            if (receipt) {
              this.validatePurchasedReceipt(receipt, true);
            }
          });
        })
      ).catch((error) => {
        this.setState({ isRestoringPurchases: false });
        setTimeout(() => { this.handleError(error.message); }, 500);
      });
  }

  /**
   * Navigate to specific store for canceling subscriptions.
   *
   * @return void
   */
  handleCancelSubscription = () => {
    const { viewedProduct } = this.props;
    Platform.OS === 'ios' ? Linking.openURL(Config.IOS) : Linking.openURL(`${Config.ANDROID}${viewedProduct.productId}`);
  }

  /**
   * Register a callback that gets called when the store has any
   * updates to purchases that have not yet been finished, consumed or acknowledged.
   *
   * @return void
   */
  purchaseListener() {
    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      (purchase: RNIap.SubscriptionPurchase | RNIap.InAppPurchase) => {
        if (purchase.transactionReceipt) {
          this.validatePurchasedReceipt(purchase); // validate receipt
        } else {
          RNIap.clearTransactionIOS(); // Clear up unfinished transactions
        }
      }
    );

    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(
      (error: RNIap.PurchaseError) => {
        let { message } = error;
        if (error.code === 'E_ALREADY_OWNED') {
          message = trans('itemAlreadyOwned');
        } else if (error.code === 'E_USER_CANCELLED' && Platform.OS === 'ios') {
          return;
        }
        this.setState({ showSpinner: false });
        setTimeout(() => { this.handleError(message); }, 500);
      }
    );
  }

  /**
   * Validates the receipt.
   * If it is valid, finish the transaction
   *
   * @param {Object} receipt
   * @param {Boolean} restorePurchase if true, disregard calling finishTransaction method.
   */
  async validatePurchasedReceipt(receipt, restorePurchase = false) {
    const vm = this;
    const { subscriptions, productList } = this.props;

    // replace ios product id to match with subscription's product ids
    const prodId = receipt.productId.replace('.iosjp', '');

    // get product price and currency
    const productInfo = productList.find(x => x.productId === receipt.productId);
    const receiptData = {
      ...receipt,
      amount: productInfo.price,
      currency: productInfo.currency,
    };
    await validateReceipt(receiptData)
      .then(async () => {
        this.setState({
          showSpinner: false,
          isRestoringPurchases: false
        });

        // update subscription status to active
        subscriptions[prodId] = true;
        if (prodId === Config.UNLIMITED_UPLOAD_ID) {
          subscriptions.image_uploads_remaining = 'unlimited';
        }
        vm.props.setSubscriptionStatus(subscriptions);

        // finish transaction for iOS / acknowledge for android
        if (!restorePurchase) {
          Platform.OS === 'ios' && await RNIap.finishTransactionIOS(receipt.transactionId);
          RNIap.finishTransaction(receipt, false);
        }
      }).catch((error) => {
        this.setState({
          showSpinner: false,
          isRestoringPurchases: false
        });
        error.text().then((response) => {
          const err = JSON.parse(response);
          if (err.error.includes('subscribed to this feature')) {
            subscriptions[prodId] = true;
            vm.props.setSubscriptionStatus(subscriptions);
          }
        });
      });
  }

  handleError(message) {
    this.setState(prevState => ({
      showDialog: !prevState.showDialog,
      dialogMessage: message
    }));
  }

  removeSubscription() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  render() {
    const {
      showSpinner, showDialog, dialogMessage, webviewVisible, url, isRestoringPurchases
    } = this.state;
    const { viewedProduct, subscriptions } = this.props;
    const prodId = viewedProduct.productId.replace('.iosjp', '');
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.white }]}>
        <Modal visible={isRestoringPurchases}>
          <View style={styles.spinnerView}>
            <Spinner />
            <Text style={styles.restoreSpinnerText}>{trans('restoringPurchases')}</Text>
          </View>
        </Modal>
        <StatusBar
          translucent
          backgroundColor={Platform.OS === 'android' && 'transparent'}
          barStyle="dark-content"
        />
        <View style={styles.detailView}>
          <FastImage
            source={{ uri: viewedProduct.imagePath }}
            resizeMode={FastImage.resizeMode.contain}
            style={[styles.image]}
          />
          <Text style={styles.itemTitle}>{viewedProduct.title}</Text>
          <Text style={[styles.planDescription, styles.marginTwo]}>
            {`${viewedProduct.price} ${viewedProduct.currency} / ${trans('month')}`}
          </Text>
          <Text style={[styles.description, styles.marginTwo]}>
            {viewedProduct.featureDescription}
          </Text>
        </View>
        <Separator customStyle={styles.separator} />
        <View style={styles.subscriptionAgreement}>
          <Text style={styles.subscriptionDetail}>
            {trans('byUpgrading')}
          </Text>
          <View style={styles.webViewContainer}>
            <Text
              style={styles.webviewText}
              onPress={() => this.showWebModal(Config.TERMS_OF_USE)}
            >
              {`${trans('termsOfUse')}.`}
            </Text>
            <Text style={styles.seeOurText}>{trans('seeOur')}</Text>
            <Text
              style={styles.webviewText}
              onPress={() => this.showWebModal(Config.PRIVACY_POLICY)}
            >
              {`${trans('privacyPolicy')}.`}
            </Text>
          </View>
          <Text style={styles.subscriptionDetail}>
            {trans('subscriptionDetail')}
          </Text>
        </View>
        <View style={styles.descriptionView}>
          <View style={styles.marginTwo}>
            {
              subscriptions[prodId] // check if product is active
                ? (
                  <Button
                    style={[styles.cancelButton]}
                    onPress={() => this.handleCancelSubscription()}
                  >
                    <Text style={styles.cancelText}>{trans('cancelSubscription')}</Text>
                  </Button>
                ) : (
                  <GradientButton
                    title={trans('subscribeNow')}
                    customStyle={[styles.gradientButton]}
                    onPress={() => this.showPurchaseDialog()}
                  />
                )
            }
          </View>
          {
            // hide restore purchase if product is already active
            !subscriptions[prodId]
            && (
              <Button onPress={() => this.restorePurchases()}>
                <Text style={styles.restorePurchasesText}>
                  {trans('restorePurchases')}
                </Text>
              </Button>
            )
          }
        </View>
        <ActionSheet
          ref={(o) => { this.confirmPurchase = o; }}
          title={trans('purchaseTitle')}
          options={confirmationArray}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              this.purchaseItem();
            }
          }}
        />
        <OverlayLoader visible={showSpinner} />
        <CustomDialog
          visible={showDialog}
          renderIcon={infoIcon}
          description={dialogMessage}
          buttonLabel={trans('ok')}
          onPress={() => {
            this.setState({
              showDialog: false
            });
          }}
        />
        <PdfViewer
          visible={webviewVisible}
          onBackButtonPress={this.showWebModal}
          onBackdropPress={this.showWebModal}
          onSwipeComplete={this.showWebModal}
          onPress={this.showWebModal}
          source={{ uri: url }}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  subscriptions: state.subscriptions,
  viewedProduct: state.product.viewed_product,
  productId: state.product.product_identifier,
  productList: state.product.product_list
});


const mapDispatchToProps = dispatch => ({
  setSubscriptionStatus: status => dispatch(setSubscriptionStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps,)(withNavigation(Details));
