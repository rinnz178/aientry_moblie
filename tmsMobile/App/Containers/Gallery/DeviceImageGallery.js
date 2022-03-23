import React, { PureComponent } from 'react';
import {
  AppState, FlatList, TouchableOpacity, View, Platform, PermissionsAndroid,
  ImageBackground, Image
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFS from 'rn-fetch-blob';
import { withNavigation } from 'react-navigation';
import CameraRoll from '@react-native-community/cameraroll';
import ImageResizer from 'react-native-image-resizer';
import { connect } from 'react-redux';
import Config from 'react-native-config';
import setSubscriptionStatus from '../../Store/SubscriptionStatus/actions';
import styles from './DeviceImageGalleryStyle';
import {
  GradientButton, HeaderBackButton
} from '../../Components';
import {
  uploadImage, ConnectionManager, Storage
} from '../../Services';
import trans from '../../Translations/Trans';
import checkIcon from '../../Images/icon_checkmark.png';
import infoIcon from '../../Images/icon_info.png';
import UploadProgress from './Components/UploadProgress';
import UnselectedImageOverlay from './Components/UnselectedImageOverlay';
import SelectedImageOverlay from './Components/SelectedImageOverlay';
import FailedUpload from './Components/FailedUpload';
import defaultNavigationOptions from '../../Navigation/NavigationOptions';
import HeaderTitle from './Components/HeaderTitle';
import HeaderUploadButton from './Components/HeaderUploadButton';

let cancel;
class DeviceImageGallery extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const {
      uploadsRemaining, totalSelected, enableUploadButton, compressImage
    } = navigation.state.params;
    return ({
      ...defaultNavigationOptions,
      headerTitle: () => (
        uploadsRemaining !== 'unlimited' && (
          <HeaderTitle
            title={`${totalSelected || 0} / ${uploadsRemaining}`}
          />
        )
      ),
      headerRight: () => (
        <HeaderUploadButton
          disabled={enableUploadButton}
          onPress={compressImage}
        />
      ),
      headerLeft: () => (
        <HeaderBackButton onPress={() => navigation.goBack()} />
      ),
    });
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const { siteId } = navigation.state.params;
    this.state = {
      appState: AppState.currentState,
      photos: [],
      lastCursor: null,
      hasNoMorePhotos: false,
      siteId,
      selectedPhotos: [],
      descriptionMessage: trans('upload'),
      dialogImage: infoIcon,
      uploadProgress: 0,
      buttonLabel: trans('cancel'),
      isConnected: true,
      uploadError: false,
      failedImages: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ compressImage: this.compressImage });
    AppState.addEventListener('change', this.handleAppStateChange);
    this.requestAccessStoragePermission();
    this.getPhotos();
    this.errorChecker();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isConnected } = this.state;

    if (!prevState.isConnected && isConnected) {
      this.errorChecker();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  setMetadata(data) {
    this.setState(data);
  }

  /**
   * Retrieve device's images.
   * @return void
   */
  getPhotos = () => {
    const { lastCursor, photos } = this.state;
    const params = {
      first: 30,
      assetType: 'Photos',
      include: ['location'],
    };

    if (lastCursor) {
      params.after = lastCursor;
    }

    CameraRoll.getPhotos(params).then((photoList) => {
      photoList.edges.forEach(({ node }) => {
        let photo = {
          uri: node.image.uri,
          filename: node.image.filename || node.image.uri,
          type: node.type,
          selected: false
        };
        if (Platform.OS === 'ios') { // update uri if platform is iOS
          const regex = /:\/\/(.{36})\//i;
          const result = node.image.uri.match(regex);
          const appleId = node.image.uri.substring(5, 41);
          const finalPath = `assets-library://asset/asset.JPEG?id=${appleId}&ext=JPEG`;
          photo = { ...photo, filename: `${result[1]}.jpg`, uri: finalPath };
        }
        if (!photos.some(element => element.filename === photo.filename)) {
          photos.push(photo);
        }
      });
      const hasNoNextPage = !photoList.page_info.has_next_page;
      this.setState({
        lastCursor: photoList.page_info.end_cursor,
        hasNoMorePhotos: hasNoNextPage
      });

      this.getImageData(); // add size and image orientation
    });
  }

  /**
   * Will get the size and orientation of the image.
   * @return void
   */
  getImageData() {
    const { photos } = this.state;

    photos.forEach(async (photo, index) => {
      const { size, Orientation = 1 } = await RNFS.fs.stat(photo.uri);
      photos[index].Orientation = Orientation;
      photos[index].size = size;
    });
  }

  handleConnectionState = async (isConnected) => {
    this.setState({
      isConnected,
    });
  }

  /**
   * Permission to access user's local storage. This is only for Android platform.
   * @return void
   */
  requestAccessStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: trans('permissionStorageTitle'),
          message: trans('permissionStorageMessage'),
          buttonNegative: trans('cancel'),
          buttonPositive: trans('ok'),
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getPhotos();
      }
    } catch (err) {
      console.warn(err); // eslint-disable-line
    }
  }

  /**
   * Checks if previous state is inactive/background and current state is active,
   * if true, update the photos state.
   * @return void
   */
  handleAppStateChange = (nextAppState) => {
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      this.setState({
        photos: [],
        lastCursor: null,
        hasNoMorePhotos: false,
        selectedPhotos: [],
      });
      this.getPhotos();
    }

    this.setState({ appState: nextAppState });
  }

  /**
   * Handles the behavior when selecting an image.
   * @param {Object} data
   * @return void
   */
  handlePress = (data) => {
    const { navigation, subscriptions } = this.props;
    const isSubscriber = subscriptions[Config.UNLIMITED_UPLOAD_ID];
    const uploadLimit = subscriptions.image_uploads_remaining;
    const {
      selectedPhotos, photos
    } = this.state;

    this.setState({
      shouldUpdateList: false
    });

    if (!selectedPhotos.some(element => element.filename === data.filename)) {
      if (!isSubscriber && selectedPhotos.length + 1 > uploadLimit) return null;
      selectedPhotos.push(data); // append data
    } else {
      const index = selectedPhotos.findIndex(x => x.filename === data.filename);
      selectedPhotos.splice(index, 1); // remove the photo from the array
    }

    navigation.setParams({
      totalSelected: selectedPhotos.length,
      enableUploadButton: selectedPhotos.length > 0
    });

    // get index
    const i = photos.findIndex(
      item => item.filename === data.filename
    );

    // update the selected property to true/false
    this.setState((prevState) => {
      const prevPhotos = [...prevState.photos];
      photos[i] = {
        ...prevPhotos[i],
        selected: !data.selected
      };
    }, () => this.setState({ shouldUpdateList: true }));
    return null;
  }

  /**
   * This function will be called if there is an image saved after capturing photo.
   * @return void
   */
  handleSavedImage = () => {
    this.setState({
      photos: [{}],
      lastCursor: null,
      hasNoMorePhotos: false,
      selectedPhotos: [],
    });
  }

  /**
   * Resize the selected image/s before uploading.
   * @return void
   */
  compressImage = async () => {
    const { selectedPhotos, siteId } = this.state;
    const photoHolder = selectedPhotos;
    /* eslint-disable */
    const data = new FormData();
    /* eslint-enable */

    if (Platform.OS === 'ios') {
      data.append('site_id', siteId);
      photoHolder.forEach((photo, index) => {
        data.append(`files[${index}]`, {
          uri: photo.uri,
          type: 'image/jpeg',
          name: photo.filename,
        });
        data.append(`files[${index}][orientation]`, 1);
      });
      data.append('requester[from]', 'MOBILE');
      data.append('requester[error_tag]', 'false');
      // call upload api
      this.upload(data);
    } else {
      await Promise.all(photoHolder.map((f, index) => ImageResizer.createResizedImage(f.uri, 1920, 1440, 'JPEG', 100, 0, null, true)
        .then((response) => {
          photoHolder[index].uri = response.uri;
        })))
        .then(() => {
        // transform to Form Data
          data.append('site_id', siteId);
          photoHolder.forEach((photo, index) => {
            data.append(`files[${index}]`, {
              uri: photo.uri,
              type: 'image/jpeg',
              name: photo.filename,
            });
            data.append(`files[${index}][orientation]`, 1);
          });
          data.append('requester[from]', 'MOBILE');
          data.append('requester[error_tag]', 'false');
          // call upload api
          this.upload(data);
        }).catch((error) => {
        console.log('Error Resizing Photo(s).', error); // eslint-disable-line
        });
    }
  }

  /**
   * Upload selected image/s
   * @param {FormData} data
   * @return void
   */
  upload = (data) => {
    const vm = this;
    const { photos } = this.state;
    const { navigation } = this.props;
    this.setState({
      showProgressDialog: true
    });
    this.resetUploadStates();
    uploadImage(data,
      (progressEvent) => {
        const { loaded, total } = progressEvent;
        vm.setState({
          uploadProgress: loaded / total
        });
      },
      (cancelToken) => {
        cancel = cancelToken;
      })
      .then((response) => {
        vm.setState({
          dialogImage: checkIcon,
          descriptionMessage: trans('successImageUpload'),
          selectedPhotos: [],
          buttonLabel: trans('close')
        });
        vm.setState((prevState) => {
          photos.forEach((metadata, index) => {
            const prevPhotos = [...prevState.photos];
            photos[index] = {
              ...prevPhotos[index],
              selected: false
            };
          });
        });
        vm.props.setSubscriptionStatus(response.data.data.subscriptions);
        navigation.setParams({
          totalSelected: 0,
          uploadsRemaining: response.data.data.subscriptions.image_uploads_remaining,
          enableUploadButton: false
        });
        this.deleteFailedImages();
      }).catch((error) => {
        let message = '';
        const networkError = 'Network Error';
        if (error.message === networkError) {
          message = trans('networkRequestFailed');
        } else if (error.response.status === 409) {
          message = trans('maximumUpload');
        } else if (error.response.status === 500) {
          message = trans('duplicate');
        }

        message === networkError ? this.handleErrorUpload() : this.deleteFailedImages();
        vm.setState({
          descriptionMessage: message,
          dialogImage: infoIcon,
          buttonLabel: trans('close')
        });
      });
  }

  /**
   * Cancel/Close the dialog while uploading the image/s.
   * @return void
   */
  handleDialogBehavior = () => {
    const { showProgressDialog, uploadProgress } = this.state;

    if (uploadProgress < 100) { // Cancel upload api request
      cancel('Upload canceled');
    }

    this.setState({
      showProgressDialog: !showProgressDialog,
    });
  }

  /**
   * Reset Dialog states before uploading.
   * @return void
   */
  resetUploadStates = () => {
    this.setState({
      buttonLabel: trans('cancel'),
      descriptionMessage: trans('upload'),
      uploadProgress: 0,
      dialogImage: null,
    });
  }

  /**
   * Will upload failed images to error folder in CMS
   *
   * @return void
   */
  async errorUpload() {
    /* eslint-disable */
    const data = new FormData();
    /* eslint-enable */
    const { siteId } = this.state;
    const failedImages = await Storage.getData('FAILEDUPLOADIMAGES');
    const restoredData = JSON.parse(failedImages);

    if (restoredData !== null) {
      this.setState({
        uploadError: true,
      });

      data.append('site_id', siteId);
      restoredData.forEach((photo, index) => {
        data.append(`files[${index}]`, {
          uri: photo.uri,
          type: photo.type,
          name: photo.filename,
        });
        data.append(`files[${index}][orientation]`, photo.Orientation);
      });
      data.append('requester[from]', 'MOBILE');
      data.append('requester[error_tag]', 'true');
      this.upload(data);
    }
  }

  /**
   * Checks local storage if there are any stored images.
   * Sets uploadError to true and shows failed images to screen.
   *
   * @return void
   */
  async errorChecker() {
    const images = await Storage.getData('FAILEDUPLOADIMAGES');
    const parsedImages = JSON.parse(images);
    if (parsedImages !== null) {
      this.setState({
        uploadError: true,
        failedImages: parsedImages,
      });
    }
  }

  /**
   * Stores selected images to local storage
   *
   * @return void
   */
  async handleErrorUpload() {
    const { selectedPhotos } = this.state;
    const stringifiedData = JSON.stringify(selectedPhotos);
    await Storage.storeData('FAILEDUPLOADIMAGES', stringifiedData);
  }

  /**
   * Will close list of failed images tab and
   * delete failed images that is stored in local storage.
   *
   * @return void
   */
  async deleteFailedImages() {
    this.setState({
      uploadError: false
    });
    await Storage.removeData('FAILEDUPLOADIMAGES');
  }

  render() {
    const {
      photos, shouldUpdateList, descriptionMessage, dialogImage,
      hasNoMorePhotos, uploadProgress, showProgressDialog, buttonLabel,
      uploadError, failedImages
    } = this.state;
    const { navigation, subscriptions } = this.props;

    return (
      <View style={[styles.container, styles.screenHeight, styles.screenWidth]}>
        <ConnectionManager connection={this.handleConnectionState} />
        <UploadProgress
          visible={showProgressDialog}
          progress={uploadProgress}
          renderIcon={dialogImage}
          onModalHide={() => this.resetUploadStates()}
          description={descriptionMessage}
          buttonLabel={buttonLabel}
          onPress={() => this.handleDialogBehavior()}
        />
        {
          !subscriptions[Config.UNLIMITED_UPLOAD_ID]
          && (
            <View style={styles.gradientButtonContainer}>
              <GradientButton
                title={trans('upgradeToPremium')}
                onPress={() => navigation.navigate('Upgrades')}
                customStyle={styles.upgradeButton}
              />
            </View>
          )
        }
        <FlatList
          style={styles.screenWidth}
          data={photos}
          numColumns={3}
          extraData={shouldUpdateList}
          horizontal={false}
          keyExtractor={(_item, index) => index}
          ListHeaderComponent={() => uploadError
          && (
            <FailedUpload
              reupload={() => this.errorUpload()}
              close={() => this.deleteFailedImages()}
              data={failedImages}
              renderItem={({ item }) => (
                <View style={styles.viewFailedImages}>
                  <Image
                    style={styles.failedImages}
                    source={{ uri: item.uri }}
                  />
                </View>
              )}
              keyExtractor={(item, index) => index}
            />
          )}
          onEndReached={!hasNoMorePhotos && this.getPhotos}
          onEndReachedThreshold={0.5}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.thumbnailContainer}
              activeOpacity={1}
              onPress={() => this.handlePress({ ...item, index })
              }
            >
              { // use ImageBackground Component if Platform is iOS
                (Platform.OS === 'ios')
                  && (
                    <ImageBackground
                      source={{ uri: item.uri }}
                      style={styles.imageThumbnail}
                    >
                      {item.selected ? <SelectedImageOverlay /> : <UnselectedImageOverlay />}
                    </ImageBackground>
                  )
              }
              { // use FastImage Component if Platform is android
                (Platform.OS === 'android')
                  && (
                    <FastImage
                      source={{ uri: item.uri }}
                      style={styles.imageThumbnail}
                    >
                      {item.selected ? <SelectedImageOverlay /> : <UnselectedImageOverlay />}
                    </FastImage>
                  )
              }
            </TouchableOpacity>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps,)(withNavigation(DeviceImageGallery));
