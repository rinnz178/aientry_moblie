import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import {
  StyleSheet, View, Text, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import CameraRoll from '@react-native-community/cameraroll';
import ImageResizer from 'react-native-image-resizer';
import DropDownPicker from 'react-native-dropdown-picker';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import {
  uploadImage
} from '../../Services';
import setSubscriptionStatus from '../../Store/SubscriptionStatus/actions';
import {
  Camera, Button, CustomIcon, Modal, CustomDialog
} from '../../Components';
import UploadProgress from './Components/UploadProgress';
import checkIcon from '../../Images/icon_checkmark.png';
import infoIcon from '../../Images/icon_info.png';
import Colors from '../../Themes';
import trans from '../../Translations/Trans';

let cancel;
class CameraScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      captured: false,
      imageCaptured: '',
      disabled: false,
      siteChoices: false,
      flash: false,
      isPortrait: true,
      sites: [],
      albumSelected: null,
      canUpload: false,
      showProgressDialog: false,
      buttonLabel: trans('cancel'),
      uploadProgress: 0,
      dialogImage: infoIcon,
      showMaxUploadDialog: false
    };
  }

  async componentDidMount() {
    this.retrieveAssignedSites();
  }

  retrieveAssignedSites = () => {
    const { user } = this.props;
    const { sites } = this.state;

    if (user.site_users) {
      this.setState({ albumSelected: user.site_users[0].site_id });
      for (let i = 0; i < user.site_users.length; i += 1) {
        const siteDetails = {
          value: user.site_users[i].site_id,
          label: user.site_users[i].site_name
        };
        sites.push(siteDetails);
      }
    }
  }

  takePicture = async () => {
    const { captured } = this.state;
    const { userLocation } = this.props;
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        exif: true,
        writeExif: {
          GPSLatitude: userLocation.latitude,
          GPSLongitude: userLocation.longitude,
          GPSAltitude: userLocation.altitude
        },
      };
      // takePictureAsync will store captured image to cache
      await this.camera.takePictureAsync(options).then((data) => {
        if (data.pictureOrientation !== 1) {
          this.setState({
            isPortrait: false,
          });
        }
        this.setState({
          captured: !captured,
          imageCaptured: data,
        });
      });
    }
  };

  /**
   * Upload picture to a specific album.
   * if user has only one assigned site, it will upload directly.
   * if user has two or more assigned sites, user will be asked
   * where to upload the picture.
   *
   * @return null
   */
  uploadPicture = async () => {
    const { sites } = this.state;
    const { subscriptions } = this.props;
    const isSubscriber = subscriptions[Config.UNLIMITED_UPLOAD_ID];
    const uploadLimit = subscriptions.image_uploads_remaining;

    // already reached upload limit
    if (!isSubscriber && uploadLimit < 1) {
      this.setState({
        showMaxUploadDialog: true,
        dialogMessage: trans('maxUploadLimit')
      });
      return;
    }

    // select album if user has more than 1 site
    if (sites.length > 1) {
      this.setState({ siteChoices: true });
      return;
    }

    this.compressImage();
  }

  /**
   * Resize the image before uploading.
   * @return void
   */
  compressImage = async () => {
    this.setState({
      siteChoices: false
    });
    const { imageCaptured, albumSelected } = this.state;
    /* eslint-disable */
    const data = new FormData();
    /* eslint-enable */
    ImageResizer.createResizedImage(imageCaptured.uri, 1920, 1440, 'JPEG', 100, 0, null, true)
      .then((response) => {
        const iosUri = response.uri.replace('file://', '/private');
        const uri = Platform.OS === 'ios' ? iosUri : response.uri;
        data.append('site_id', albumSelected);
        data.append('files[0]', {
          uri,
          type: 'image/jpeg',
          name: response.name,
        });
        data.append('files[0][orientation]', 1);
        data.append('requester[from]', 'MOBILE');
        data.append('requester[error_tag]', 'false');
        this.upload(data);
      })
      .catch((error) => {
        console.log('Error Resizing Photo(s).', error); // eslint-disable-line
      });
  }

  /**
   * Upload selected image/s
   * @param {FormData} data
   * @return void
   */
  upload = (data) => {
    const vm = this;
    setTimeout(() => {
      this.setState({
        showProgressDialog: true
      });
    }, 300);


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
          buttonLabel: trans('close')
        });
        vm.props.setSubscriptionStatus(response.data.data.subscriptions);
      }).catch((error) => {
        let message = trans('networkRequestFailed');
        const networkError = 'Network Error';
        if (error.message === networkError) {
          message = trans('networkRequestFailed');
        } else if (error.response.status === 409) {
          message = trans('maximumUpload');
        } else if (error.response.status === 500) {
          message = trans('duplicate');
        }
        vm.setState({
          descriptionMessage: message,
          dialogImage: infoIcon,
          buttonLabel: trans('close')
        });
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
    this.closePreview();
  }

  /**
   * Go back to camera state.
   * */
  closePreview = async () => {
    const { captured, imageCaptured } = this.state;
    this.setState({
      captured: !captured,
      isPortrait: true,
    });
    // delete cached image
    CameraRoll.deletePhotos([imageCaptured.uri]);
  }

  flashHandler = () => {
    const { flash } = this.state;
    this.setState({ flash: !flash });
  }

  navigateBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  }

  render() {
    const {
      captured, imageCaptured, disabled, flash, isPortrait, showProgressDialog,
      uploadProgress, dialogImage, descriptionMessage, buttonLabel, showMaxUploadDialog,
      dialogMessage, siteChoices, canUpload, sites
    } = this.state;
    return (
      <View style={styles.container}>
        <UploadProgress
          visible={showProgressDialog}
          progress={uploadProgress}
          renderIcon={dialogImage}
          onModalHide={() => this.resetUploadStates()}
          description={descriptionMessage}
          buttonLabel={buttonLabel}
          onPress={() => this.handleDialogBehavior()}
        />
        <CustomDialog
          renderIcon={infoIcon}
          visible={showMaxUploadDialog}
          buttonLabel={trans('ok')}
          description={dialogMessage}
          onPress={() => {
            this.navigateBack();
            this.setState({ showMaxUploadDialog: false, captured: false });
          }}
        />
        <Modal visible={siteChoices}>
          <View style={styles.siteChoicesContainer}>
            <Button
              style={styles.closeButton}
              onPress={() => this.setState({ siteChoices: false, canUpload: false })}
            >
              <CustomIcon name="close" size={30} />
            </Button>
            <Text style={styles.title}>
              {trans('selectAlbum')}
            </Text>
            <DropDownPicker
              items={sites}
              containerStyle={{ height: 40 }}
              style={styles.dropDownStyle}
              placeholder={trans('selectSite')}
              itemStyle={{
                justifyContent: 'flex-start'
              }}
              dropDownStyle={styles.dropDownStyle}
              onChangeItem={item => this.setState({
                albumSelected: item.value,
                canUpload: true
              })
            }
            />
            <Button
              onPress={this.compressImage}
              disabled={!canUpload}
              style={[styles.uploadBtn, {
                backgroundColor: canUpload ? Colors.base : Colors.gainsboro
              }]}
            >
              <Text style={styles.uploadText}>
                {trans('upload')}
              </Text>
            </Button>
          </View>
        </Modal>

        { // show camera
          (!captured)
          && (
            <Camera
              camref={(camref) => {
                this.camera = camref;
              }}
              flashPress={() => this.flashHandler()}
              flashCapture={flash}
              onPress={() => this.takePicture()}
              backPress={() => this.navigateBack()}
              disabled={disabled}
            />
          )
        }
        { // show preview of the image recently captured.
          (captured)
          && (
            <View style={styles.preview}>
              <FastImage
                source={{ uri: imageCaptured.uri }}
                style={isPortrait ? styles.fastImagePortrait : styles.fastImageLandscape}
              />
              <Button onPress={() => this.closePreview()} style={styles.close}>
                <CustomIcon
                  color={Colors.white}
                  name="chevron-back"
                  size={responsiveWidth(12)}
                />
              </Button>
              <Button
                onPress={() => this.uploadPicture()}
                style={styles.saveButton}
                disabled={disabled}
              >
                <View style={styles.wrapper}>
                  <CustomIcon
                    color={Colors.white}
                    name="send"
                    size={50}
                  />
                  <Text style={styles.saveText}>{trans('upload')}</Text>
                </View>
              </Button>
            </View>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saveButton: {
    position: 'absolute',
    bottom: 0,
    right: 10
  },
  saveText: {
    fontSize: 16,
    color: Colors.white
  },
  close: {
    position: 'absolute',
    top: 40,
    left: 15
  },
  wrapper: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  preview: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  fastImagePortrait: {
    aspectRatio: 3 / 4
  },
  fastImageLandscape: {
    aspectRatio: 4 / 3,
  },
  // site choices styles
  siteChoicesContainer: {
    width: '80%',
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 10
  },
  closeButton: {
    position: 'absolute',
    right: 10
  },
  title: {
    marginTop: 30,
    fontSize: 18
  },
  uploadBtn: {
    height: 40,
    width: '100%',
    justifyContent: 'center',
    marginTop: 30
  },
  uploadText: {
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    color: Colors.white
  },
  // dropdown style
  dropDownStyle: {
    backgroundColor: '#fafafa'
  }
});

const mapStateToProps = state => ({
  subscriptions: state.subscriptions,
  user: state.user.user,
  userAttendance: state.user.userAttendance,
  userLocation: state.userLocation
});

const mapDispatchToProps = dispatch => ({
  setSubscriptionStatus: isSubscriber => dispatch(setSubscriptionStatus(isSubscriber)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(CameraScreen));
