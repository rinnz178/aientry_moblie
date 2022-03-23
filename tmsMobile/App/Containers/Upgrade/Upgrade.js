import React, { PureComponent } from 'react';
import {
  View, Text, Platform,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import * as RNIap from 'react-native-iap';
import { connect } from 'react-redux';
import setSubscriptionStatus from '../../Store/SubscriptionStatus/actions';
import { setViewedProduct, setProductList } from './Store/actions';
import styles from './UpgradeStyle';
import { List, Spinner, Placeholder } from '../../Components';
import UpgradeList from './Components/UpgradeList';
import trans from '../../Translations/Trans';
import getUserSubscription from '../../Utils/SubscriptionStatus';

class Upgrade extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      isFetching: true,
      featureDescription: [
        trans('kytDescription'),
        trans('unlimitedImageDescription'),
      ],
      iStoreError: false,
    };

    this.navigateDetails = this.navigateDetails.bind(this);
  }

  async componentDidMount() {
    const { isConnected } = this.state;
    const vm = this;
    if (isConnected) {
      const userSubscription = await getUserSubscription();
      vm.props.setSubscriptionStatus(userSubscription);
      this.getSubscriptionList();
    }
  }

  /**
   * Retrieve available products from Google Play Store or App Store.
   * @param {Array} itemSkus product id
   *
   * @return void
   */
  async getSubscriptionList() {
    const { featureDescription } = this.state;
    const { productId, setProduct } = this.props;
    let itemSkus = [];
    productId.forEach((id) => {
      const prodId = id.product_identifier.concat(Platform.OS === 'ios' ? '.iosjp' : '');
      itemSkus = [...itemSkus, prodId]; // store Product ID
    });

    RNIap.initConnection()
      .then(
        await RNIap.getSubscriptions(itemSkus).then((response) => {
          response.forEach((data, index) => {
            response[index] = {
              ...data,
              imagePath: productId[index].image_path, // insert image to product
              featureDescription: featureDescription[index], // insert features description
            };
          });
          this.setState({
            isFetching: false,
            iStoreError: false,
          });
          setProduct(response);
        }).catch((error) => {
          if (error.code === 'E_UNKOWN' && Platform.OS === 'ios') {
            this.setState({ iStoreError: true });
          }
          /* eslint-disable */
          console.log('error', error);
          /* eslint-enable */
        })
      )
      .catch((error) => {
        if (error.code === 'E_UNKOWN' && Platform.OS === 'ios') {
          this.setState({ iStoreError: true });
        }
        /* eslint-disable */
        console.log(error.message);
        /* eslint-enable */
      });
  }

  /**
   * Will navigate to Detail Screen
   * @param {Object} item
   *
   * @return void
   */
  navigateDetails(item) {
    const vm = this;
    const isSubscriber = vm.props.subscriptions[item.productId];
    vm.props.setViewedProduct({ ...item, isSubscriber });

    const { navigation } = this.props;
    navigation.navigate('Details');
  }

  render() {
    const { isFetching, iStoreError, isConnected } = this.state;
    const { productList } = this.props;

    return (
      <View style={styles.container}>
        { isFetching && <Spinner hideStatusBar={false} /> }
        { // shows message when user is not subscribed to this feature
          (iStoreError && !isFetching)
          && (
            <Placeholder
              style={styles.iStoreErrorContainer}
              hideImage
              message={trans('iTunesStoreError')}
              btnText={trans('retry')}
              btnStyle={styles.promotionalBtn}
              onPress={() => isConnected && this.getSubscriptionList()}
            />
          )
        }
        {
          (!isFetching && !iStoreError)
          && (
            <>
              <Text style={styles.subtitle}>{trans('featuresList')}</Text>
              <List
                data={productList}
                hideButton
                renderItem={({ item }) => (
                  <UpgradeList
                    source={{ uri: item.imagePath }}
                    data={item}
                    chevronSize={15}
                    onPress={() => this.navigateDetails(item)}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </>
          )
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  subscriptions: state.subscriptions,
  productId: state.product.product_identifier,
  productList: state.product.product_list,
});

const mapDispatchToProps = dispatch => ({
  setSubscriptionStatus: status => dispatch(setSubscriptionStatus(status)),
  setViewedProduct: product => dispatch(setViewedProduct(product)),
  setProduct: product => dispatch(setProductList(product)),
});

export default connect(mapStateToProps, mapDispatchToProps,)(withNavigation(Upgrade));
