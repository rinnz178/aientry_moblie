import React, { PureComponent } from 'react';
import {
  View, Text, TouchableOpacity
} from 'react-native';
import { withNavigation, NavigationActions, NavigationEvents } from 'react-navigation';
import ActionSheet from 'react-native-actionsheet';
import ImageView from 'react-native-image-viewing';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import styles from './SiteGalleryStyle';
import setSubscriptionStatus from '../../Store/SubscriptionStatus/actions';
import { siteImages, ConnectionManager, deleteImages } from '../../Services';
import logoutUser from '../../Utils/LogoutHelper';
import {
  Button, Spinner, List, OverlayLoader, HeaderBackButton
} from '../../Components';
import trans from '../../Translations/Trans';
import Colors from '../../Themes';
import SelectedImageOverlay from './Components/SelectedImageOverlay';
import getUserSubscription from '../../Utils/SubscriptionStatus';
import defaultNavigationOptions from '../../Navigation/NavigationOptions';
import HeaderTitle from './Components/HeaderTitle';
import HeaderGalleryIcon from './Components/HeaderGalleryButton';
import ListIcon from '../../Images/EmptyListPlaceholders/album_placeholder.png';

const confirmationArray = [
  trans('deletePhoto'),
  trans('cancel'),
];

class SiteGallery extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    ...defaultNavigationOptions,
    headerTitle: () => (
      <HeaderTitle title={navigation.state.params.siteName} />
    ),
    headerRight: () => (
      <HeaderGalleryIcon
        isVisible={!navigation.getParam('isSelecting')}
        onPress={navigation.getParam('localGallery')}
      />
    ),
    headerLeft: () => (
      !navigation.getParam('isSelecting') && (
        <HeaderBackButton name="ios-close" onPress={() => navigation.goBack(null)} />
      )
    ),
  });

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    // Get site id from Album View screen.
    const { siteId } = navigation.state.params;
    this.state = {
      photos: [],
      selectedImages: [], // image ids to be deleted
      isConnected: true,
      isFetching: true,
      serverError: false,
      isSelecting: false,
      showModalSpinner: false,
      shouldUpdateList: false,
      siteId,
      emptyDataMessage: trans('emptyGallery'),
      previewImage: {
        index: 0,
        isVisible: false,
      }
    };

    this.openImage = this.openImage.bind(this);
    this.openLocalGallery = this.openLocalGallery.bind(this);
  }

  /**
   * Calls site images API.
   *
   * @return void
   */
  componentDidMount() {
    const { isSelecting } = this.state;
    const { navigation } = this.props;
    navigation.setParams({
      localGallery: this.openLocalGallery,
      isSelecting
    });
    const { isConnected } = this.state;
    // call API if there is an internet connection
    if (isConnected) {
      this.getImages();
    }
  }

  /**
   * Will call the API if the connection changes from offline to online.
   * @param {Object} { isConnected } - prevState
   *
   * @return void
   */
  componentDidUpdate(prevProps, prevState) {
    const { isConnected } = this.state;
    // retrieve images if the previous state is offline and current is online
    if (!prevState.isConnected && isConnected) {
      this.getImages();
    }
  }

  /**
   * This function will get the value of connection props from ConnectionManager.
   *
   * @return void
   */
  handleConnectionState = async (isConnected) => {
    this.setState({ isConnected });
  }

  /**
   * Retrieve images.
   *
   * @return void
   */
  getImages = () => {
    const vm = this;
    const { isConnected, siteId } = this.state;
    const { navigation } = this.props;

    // API call
    siteImages(siteId)
      .then((response) => {
        const { files } = response.data;
        const photoHandler = [];
        let object;

        this.handleShouldUpdateList();
        // create object for ImageViewer component
        files.forEach((image) => {
          object = {
            id: image.id,
            isSelect: false,
            uri: image.file_path,
            width: 806,
            height: 720,
          };
          // checks if image already exist
          if (!photoHandler.some(o => o.id === object.id)) {
            photoHandler.push(object);
            this.handleShouldUpdateList();
          }
        });
        // update photos state
        vm.setState({
          photos: files.length > 0 ? photoHandler : [],
          isFetching: false,
        });
      }).catch((error) => {
        // unauthenticated or expired token
        if (error.status === 401) {
          logoutUser(isConnected, navigation);
        } else {
          isConnected && vm.setState({ serverError: true, isFetching: true });
        }
      });
  }

  /**
   * Function that handles the state of shouldUpdateList
   *
   * @return void
   */
  handleShouldUpdateList = () => {
    this.setState(prevState => ({
      shouldUpdateList: !prevState.shouldUpdateList
    }));
  }

  /**
   * This will open the image in full screen mode.
   * @param {Integer} index
   *
   * @return void
   */
  openImage = (index) => {
    this.setState({
      previewImage: {
        index,
        isVisible: true
      }
    });
  }

  /**
   * This will open the Local Gallery.
   *
   * @return void
   */
  openLocalGallery = () => {
    const { navigation, subscriptions } = this.props;
    const { siteId } = this.state;
    const navigateAction = NavigationActions.navigate({
      params: {
        siteId,
        uploadsRemaining: subscriptions.image_uploads_remaining
      },
      routeName: 'DeviceImageGallery',
      key: null
    });
    navigation.dispatch(navigateAction);
  }

  /**
   * This Function will handle the selected images.
   * @param {Integer} data
   *
   * @return void
   */
  selectImage = (data) => {
    const { photos, selectedImages } = this.state;
    const isSelected = !data.isSelect;
    this.handleShouldUpdateList();

    // checks if image already exist
    if (!selectedImages.some(o => o === data.id)) {
      selectedImages.push(data.id);
    } else {
      selectedImages.splice(selectedImages.indexOf(data.id), 1);
    }

    const i = photos.findIndex(
      item => data.id === item.id
    );
    photos[i].isSelect = isSelected;
    this.setState({
      photos,
    }, () => this.handleShouldUpdateList());
  }

  /**
   * Function that will handle the state of select button
   *
   * @return void
   */
  handleSelectOnPress = () => {
    const { isSelecting, photos } = this.state;
    const { navigation } = this.props;
    const vm = this;

    photos.forEach((element, index) => {
      vm.setState((prevState) => {
        const prevPhotos = [...prevState.photos];
        photos[index] = {
          ...prevPhotos[index],
          isSelect: false
        };
      });
    });

    this.setState({
      isSelecting: !isSelecting,
      selectedImages: [] // reset selected images
    }, () => navigation.setParams({ isSelecting: !isSelecting }));
  }

  /**
   * Prompt dialog
   *
   * @return void
   */
  promptDeleteDialog = () => {
    this.deleteConfirmation.show();
  }

  /**
   * Function that will delete the selected images.
   *
   * @return void
   */
  deleteImage = () => {
    const { selectedImages, photos, isConnected } = this.state;
    const { navigation } = this.props;
    const vm = this;

    this.setState({
      showModalSpinner: true
    });
    this.handleShouldUpdateList();
    // delete images API
    deleteImages(selectedImages).then(async () => {
      selectedImages.forEach((element) => {
        photos.splice(photos.findIndex(item => item.id === element), 1);
      });

      this.handleShouldUpdateList();
      const status = await getUserSubscription();
      vm.props.setSubscriptionStatus(status);
      vm.setState({
        isSelecting: false,
        showModalSpinner: false,
        selectedImages: []
      }, () => navigation.setParams({ isSelecting: false }));
    }).catch((error) => {
      // unauthenticated or expired token
      navigation.setParams({
        isSelecting: false
      });
      if (error.status === 401) {
        logoutUser(isConnected, navigation);
      } else {
        isConnected && vm.setState({ serverError: true, isFetching: true });
      }
    });
  }

  render() {
    const {
      photos, previewImage, isFetching, serverError, isConnected, emptyDataMessage,
      isSelecting, showModalSpinner, shouldUpdateList, selectedImages
    } = this.state;

    return (
      <View style={[styles.container, styles.screenHeight, styles.screenWidth]}>
        <NavigationEvents
          onDidFocus={() => isConnected && this.getImages()}
        />
        <OverlayLoader
          visible={showModalSpinner}
        />
        <ConnectionManager connection={this.handleConnectionState} />
        { // renders spinner while fetching data from API
          (isFetching && isConnected && !serverError)
            && <Spinner hideStatusBar={false} />
        }
        <ImageView
          images={photos}
          imageIndex={previewImage.index}
          visible={previewImage.isVisible}
          animationType="slide"
          presentationStyle="overFullScreen"
          onRequestClose={() => this.setState({ previewImage: { isVisible: false } })}
        />
        {
          (!isFetching && !serverError)
          && (
            <List
              style={[styles.galleryContainer, styles.screenWidth]}
              data={photos}
              numColumns={3}
              extraData={shouldUpdateList}
              onRefresh={() => isConnected && !serverError && this.getImages()}
              refreshing={isConnected && isFetching && !serverError}
              horizontal={false}
              keyExtractor={(_item, index) => index}
              hideSeparator
              imageSrc={ListIcon}
              message={emptyDataMessage}
              hideButton
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={isSelecting
                    ? () => this.selectImage(item) : () => this.openImage(index)}
                  activeOpacity={1}
                >
                  <FastImage
                    source={{ uri: item.uri }}
                    style={styles.imageHeight}
                  >
                    {
                      (item.isSelect && isSelecting)
                        && <SelectedImageOverlay />
                    }
                  </FastImage>
                </TouchableOpacity>
              )}
            />
          )
        }
        <View style={styles.bottomTabBackground}>
          <Button style={styles.selectButton} onPress={() => this.handleSelectOnPress()}>
            <Text>{ isSelecting ? trans('cancel') : trans('select') }</Text>
          </Button>
          <Button
            style={styles.deleteButtonIcon}
            onPress={() => this.promptDeleteDialog()}
            disabled={selectedImages.length < 1}
          >
            <Icon name="md-trash" type="ionicon" color={selectedImages.length < 1 ? 'darkgray' : Colors.black} />
          </Button>
        </View>

        <ActionSheet
          ref={(o) => { this.deleteConfirmation = o; }}
          options={confirmationArray}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              this.deleteImage();
            }
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  subscriptions: state.subscriptions
});

const mapDispatchToProps = dispatch => ({
  setSubscriptionStatus: isSubscriber => dispatch(setSubscriptionStatus(isSubscriber)),
});


export default connect(mapStateToProps, mapDispatchToProps,)(withNavigation(SiteGallery));
