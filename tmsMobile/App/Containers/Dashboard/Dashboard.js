import React, { PureComponent } from 'react';
import {
  View, Text, ScrollView, NativeModules,
  RefreshControl, SafeAreaView, Image, Platform
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Avatar } from 'react-native-elements';
import { isPointWithinRadius } from 'geolib';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import FastImage from 'react-native-fast-image';
import moment from 'moment-timezone';
import setSubscriptionStatus from '../../Store/SubscriptionStatus/actions';
import { setProductId } from '../Upgrade/Store/actions';
import { setUserProfile, setUserAttendance } from './Store/actions';
import logoutUserState from '../../Store/Auth/actions';
import {
  ServerError, Button, OverlayLoader, CustomIcon, CustomDialog, StatusBar, Modal
} from '../../Components';
import styles from './DashboardStyle';
import UserProfile from './Components/UserProfile';
import AttendanceTable from './Components/AttendanceTable';
import {
  profile, GeoLocationManager, attendance, ConnectionManager,
} from '../../Services';
import Colors from '../../Themes';
import { getTime, getTimeDifference } from '../../Utils/DateHelpers';
import trans from '../../Translations/Trans';
import logoutUser from '../../Utils/LogoutHelper';
import infoIcon from '../../Images/icon_info.png';
import getUserSubscription from '../../Utils/SubscriptionStatus';
import getAttendanceRemarks from '../../Utils/AttendanceRemarks';

const placeHolder = require('../../Images/default_icon.png');
const checkIcon = require('../../Images/icon_checkmark.png');

const deviceID = DeviceInfo.getUniqueId().toUpperCase();
const settingsMenu = [
  trans('userGuide'),
  trans('logout'),
  trans('cancel')
];
const confirmationArray = [
  trans('yes'),
  trans('no'),
];
const initialAttendance = {
  siteId: 0,
  isLoggedIn: false,
  timeIn: null,
  timeOut: null,
  timeDiff: null,
  remarks: '-',
  action: 'out',
  latestAttendance: null,
  currentLocation: null,
  isWithinRadius: false,
  scheduleStartTime: null
};
class Dashboard extends PureComponent {
  purchaseUpdateSubscription = null;

  purchaseErrorSubscription = null;

  constructor() {
    super();
    this.state = {
      isConnected: true,
      isFetching: true,
      serverError: false,
      isProfileVisible: false,
      modalVisible: false,
      showSuccessModal: false,
      showAttendanceInfo: false,
      dialogMessage: '',
      modalRadiusErrorVisible: false,
      // uuid: null,
    };
  }

  async componentDidMount() {
    const { isConnected } = this.state;
    const vm = this;

    if (isConnected) {
      const subscriptionStatus = await getUserSubscription();
      vm.props.setSubscriptionStatus(subscriptionStatus);
      this.retrieveUserData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isConnected } = this.state;
    // retrieve user data if previous state is offline and current is online
    if (!prevState.isConnected && isConnected) {
      this.retrieveUserData();
    }
  }

  /**
   * Temporarily commented this function, waiting for client's feedback about UUID.
   */
  // writeToClipBoard = async (uniqueID) => {
  //   Clipboard.setString(uniqueID); // set to ClipBoard
  //   this.setState({ uuid: '' });
  //   setTimeout(() => { this.setState({ uuid: uniqueID }); }, 1700);
  // }

  retrieveUserData = async () => {
    const vm = this;
    const { isConnected } = this.state;
    const { setUser, setProdId, setAttendance } = this.props;
    profile()
      .then((response) => {
        vm.setState({
          isFetching: false,
          serverError: false,
          uuid: response.data.uuid || deviceID,
        });
        setUser(response.data);
        setProdId(response.data.features);
        if (response.data.attendance !== null) {
          vm.updateAttendanceState(response.data.attendance);
        } else {
          setAttendance(initialAttendance);
        }
      }).catch((error) => {
        // unauthenticated or expired token
        if (error.status === 401) {
          vm.unauthorizeUser();
        } else {
          isConnected && vm.setState({ serverError: true, isFetching: true });
        }
      });
  }

  tapAttendanceBtn = (action) => {
    const { userLocation } = this.props;
    const isValidRequest = this.isValidRequest(action);

    if (isValidRequest) {
      this.checkAssignedSites(userLocation, action);
    }
  }

  /**
   * Checks if attendance request is valid.
   *
   * @param {String} action 'in / out'
   * @return boolean
   */
  isValidRequest = (action) => {
    const { userAttendance, user } = this.props;
    const currentDate = moment().tz('Asia/Tokyo').format('YYYY-MM-DD');
    const isOnTheSameDate = moment(userAttendance.latestAttendance).isSame(currentDate, 'day'); // latest attendance is same with current date
    this.setState({ modalVisible: true }); // show spinner
    // no workplace assigned
    if (user.site_users.length === 0) {
      this.setState({ modalVisible: false },
        () => setTimeout(() => this.setState({
          dialogMessage: trans('emptySite'),
          showAttendanceInfo: true
        }), 500));
      return false;
    }

    // already time in
    if (action === 'in' && userAttendance.isLoggedIn && isOnTheSameDate) {
      this.setState({ modalVisible: false },
        () => setTimeout(() => this.setState({
          dialogMessage: trans('hasInRecordMessage'),
          showAttendanceInfo: true
        }), 500));
      return false;
    }

    // requested time out but no new attendance record yet
    if (action === 'out' && !userAttendance.latestAttendance) {
      this.setState({ modalVisible: false },
        () => setTimeout(() => this.setState({
          dialogMessage: trans('hasNoTimeIn'),
          showAttendanceInfo: true
        }), 500));
      return false;
    }

    if (action === 'out' && !userAttendance.isLoggedIn) {
      this.setState({ modalVisible: false },
        () => setTimeout(() => this.setState({
          dialogMessage: trans('hasOutRecordMessage'),
          showAttendanceInfo: true
        }), 500));
      return false;
    }

    // requested time out but previous attendance has no time out
    if (action === 'out' && userAttendance.isLoggedIn && !isOnTheSameDate) {
      this.setState({ modalVisible: false },
        () => setTimeout(() => this.setState({
          dialogMessage: trans('prevAttendanceNoTimeOut'),
          showAttendanceInfo: true
        }), 500));
      return false;
    }

    // requested time out but no new attendance record yet
    if (action === 'out' && !userAttendance.latestAttendance) {
      this.setState({ modalVisible: false },
        () => setTimeout(() => this.setState({
          dialogMessage: trans('hasTimeIn'),
          showAttendanceInfo: true
        }), 500));
      return false;
    }

    // valid request
    return true;
  }

  /**
   * Check all assigned sites and compare if current location
   * is within site's radius or not.
   *
   * Update attendance if:
   * action is 'in' and location is within the site's radius.
   * action is 'out' and location is outside the site's radius.
   * @param {Object} currentLocation
   * @param {String} action - either 'in' or 'out'
   */
  checkAssignedSites = (currentLocation, action) => {
    const vm = this;
    const {
      user, userAttendance
    } = this.props;
    const sites = user.site_users;
    const { siteId, isLoggedIn } = userAttendance;
    let isNotWithinRadius = false;

    // loop assigned site(s)
    for (let i = 0; i < sites.length; i += 1) {
      const siteLocation = { latitude: sites[i].latitude, longitude: sites[i].longitude };
      const siteRadius = sites[i].radius;
      const locationId = (siteId === sites[i].id) ? siteId : sites[i].id;

      // calculate the distance between current location and site location then convert to Kilometer
      const isWithinRadius = isPointWithinRadius(currentLocation, siteLocation, siteRadius);
      const { latestAttendance, scheduleStartTime } = userAttendance;
      const currentDate = moment().tz('Asia/Tokyo').format('YYYY-MM-DD');
      const isOnTheSameDate = moment(latestAttendance).isSame(currentDate, 'day'); // latest attendance is same with current date

      // time in request
      if (action === 'in') {
        if (isWithinRadius && (!isLoggedIn || !isOnTheSameDate)) {
          isNotWithinRadius = false;
          vm.recordAttendance(locationId, currentLocation, action);
          break;
        }
        if (!isWithinRadius) {
          isNotWithinRadius = true;
        }
      }

      // time out request
      if (action === 'out') {
        if (isWithinRadius && siteId === sites[i].id) {
          const dateFormat = 'YYYY-MM-DD HH:mm:ss';
          const currentTime = moment().tz('Asia/Tokyo').format(dateFormat);
          const dateOfLastAttendance = moment(moment(latestAttendance).format(dateFormat));
          const timeDiff = moment(currentTime, dateFormat).diff(dateOfLastAttendance, 'hours');
          const earliestTimeIn = moment(moment(scheduleStartTime, 'HH:mm')).subtract(2, 'hours').format(dateFormat);

          if (timeDiff < 24
              && (moment(currentTime, dateFormat).isBefore(earliestTimeIn, dateFormat)
              || moment(dateOfLastAttendance, dateFormat).isAfter(earliestTimeIn, dateFormat))) {
            vm.recordAttendance(locationId, currentLocation, action);
            break;
          }
        }
        if (!isWithinRadius && siteId === sites[i].id) {
          isNotWithinRadius = true;
          break;
        }
      }
    }
    // set error message if location during attendance request is not within the radius
    if (isNotWithinRadius) {
      this.setState({ modalVisible: false },
        () => setTimeout(() => this.setState({
          dialogMessage: trans('unableToProcessAttendance'),
          showAttendanceInfo: true
        }), 500));
    }
  }

  /**
   * API request for free user or unsubscriber.
   *
   * @param {Integer} siteUserId
   * @param {Object} location
   * @param {String} status
   *
   * @return void
   */
  recordAttendance = async (siteUserId, location, status) => {
    const { isConnected } = this.state;
    const vm = this;
    attendance(siteUserId, location, status)
      .then((response) => {
        vm.setState({ modalVisible: false });
        setTimeout(() => vm.setState({ showSuccessModal: true }), 400);
        setTimeout(() => vm.setState({ showSuccessModal: false }), 1000);
        vm.updateAttendanceState(response.data);
      }).catch((error) => {
        // unauthenticated or expired token
        if (error.status === 401) {
          vm.unauthorizeUser();
        } else {
          isConnected && vm.setState({ serverError: true, isFetching: true });
        }
      });
  }

  /**
   * Updates the Attendance Table View.
   *
   * @param {Object} response - API's response
   * @return void
   */
  updateAttendanceState = (response) => {
    const { userAttendance, setAttendance } = this.props;
    /* eslint-disable */
    const {
      date_time_in, date_time_out, is_logged_in, site_user_id, latest_attendance, latitude,
      longitude, schedule_start_time
    } = response;
    const action = is_logged_in ? 'out' : 'in'; // if true, the next action should be out.
    const timeIn = getTime(date_time_in);
    const timeOut = getTime(date_time_out);
    const timeDifference = (date_time_in !== '' && date_time_out !== '')
      ? getTimeDifference(date_time_in, date_time_out) : null;
    const remarks = getAttendanceRemarks(response); // evaluate attendance
    
    setAttendance({
      ...userAttendance,
      siteId: site_user_id,
      isLoggedIn: is_logged_in,
      timeIn: date_time_in !== '' && timeIn,
      timeOut: date_time_out !== '' && timeOut,
      timeDiff: timeDifference,
      remarks,
      scheduleStartTime: schedule_start_time,
      currentLocation: { latitude, longitude },
      latestAttendance: latest_attendance,
      action
    });
    /* eslint-enable */
  }

  handleConnectionState = (isConnected) => {
    this.setState({ isConnected });
  };

  showUserProfile = () => {
    const { isProfileVisible } = this.state;
    this.setState({ isProfileVisible: !isProfileVisible });
  }

  /**
   * Navigates to AuthScreen and return the states to initialState.
   * @param {Boolean} isExpiredToken default to true
   * @return void
   */
  unauthorizeUser = async (isExpiredToken = true) => {
    const { isConnected } = this.state;
    const { navigation, deleteState } = this.props;
    logoutUser(isConnected, navigation, isExpiredToken, deleteState);
  }

  render() {
    const {
      isFetching, isConnected, showSuccessModal, showAttendanceInfo, dialogMessage,
      serverError, modalVisible, isProfileVisible, modalRadiusErrorVisible
    } = this.state;
    const { navigation, user, userAttendance } = this.props;

    const deviceLanguage = Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale
        || NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

    let locale = 'en'; // default language

    if (deviceLanguage.slice(0, 2) === 'ja') {
      locale = 'ja';
    }
    return (
      <SafeAreaView
        style={[styles.screenContainer,
          { backgroundColor: isFetching ? Colors.white : Colors.base }]}
      >
        <GeoLocationManager />
        <StatusBar />
        <ConnectionManager connection={this.handleConnectionState} />
        <Modal visible={showSuccessModal}>
          <View style={styles.checkIconWrapper}>
            <Image source={checkIcon} style={styles.checkIcon} />
          </View>
        </Modal>
        <CustomDialog
          renderIcon={infoIcon}
          visible={showAttendanceInfo}
          buttonLabel={trans('ok')}
          description={dialogMessage}
          onPress={() => this.setState({ showAttendanceInfo: false })}
        />
        <OverlayLoader
          visible={modalVisible}
        />
        {
          (isFetching && isConnected && serverError)
          && (
            <ServerError
              serverError={serverError}
              onPress={() => isConnected && this.retrieveUserData()}
            />
          )
        }
        <ScrollView
          contentContainerStyle={styles.svContainer}
          removeClippedSubviews={false}
          refreshControl={(
            <RefreshControl
              style={{ backgroundColor: Colors.base }}
              onRefresh={() => isConnected && !serverError && this.retrieveUserData()}
              refreshing={isConnected && isFetching && !serverError}
              tintColor={Colors.white}
            />
          )}
          stickyHeaderIndices={[0]}
          horizontal={false}
          bouncesZoom={false}
        >
          <View style={[styles.container]}>
            <View style={styles.linearGradientWrapper}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.7 }}
                colors={Colors.baseColorGradient}
                style={[styles.gradientWrapper, isFetching && { height: responsiveHeight(10) }]}
              >
                {
                  !isFetching && !serverError
                  && (
                  <View style={styles.avatarContainer}>
                    <View style={styles.headerButtonsWrapper}>
                      <Button onPress={() => this.ActionSheet.show()}>
                        <CustomIcon
                          name="md-settings"
                          color={Colors.white}
                        />
                      </Button>
                    </View>
                    <Avatar
                      containerStyle={styles.avatarStyle}
                      size="xlarge"
                      source={{ uri: user.profile_picture }}
                      rounded
                      renderPlaceholderContent={
                        <FastImage source={placeHolder} style={styles.avatarPlaceHolder} />
                      }
                      showEditButton
                      editButton={{
                        name: 'md-checkmark',
                        type: 'ionicon',
                        color: userAttendance.isLoggedIn ? Colors.green : Colors.red,
                        style: [styles.statusBaseStyle,
                          userAttendance.isLoggedIn ? styles.statusLogin : styles.statusLogout]
                      }}
                    />
                    <Text style={styles.name}>
                      {locale === 'ja'
                        ? `${user.last_name} ${user.first_name}`
                        : `${user.first_name} ${user.last_name}`}
                    </Text>
                    {/*
                      * Temporarily commented this view, waiting for client's feedback about UUID.
                      <DeviceID
                      onPress={() => this.writeToClipBoard(user.uuid || deviceID)}
                      UniqueID={uuid}
                    /> */}
                    {
                    user.role_id === 2 && (
                      <View style={styles.btnView}>
                        <View style={styles.attendanceBtnWrapper}>
                          <Button
                            onPress={() => this.tapAttendanceBtn('in')}
                            style={styles.attendanceBtn}
                          >
                            <Text style={styles.attendanceBtnText}>{trans('in')}</Text>
                          </Button>
                        </View>
                        <View style={styles.attendanceBtnWrapper}>
                          <Button
                            onPress={() => this.tapAttendanceBtn('out')}
                            style={[styles.attendanceBtn, { backgroundColor: Colors.red }]}
                          >
                            <Text style={styles.attendanceBtnText}>{trans('out')}</Text>
                          </Button>
                        </View>
                      </View>
                    )
                    }
                    <Button onPress={this.showUserProfile}>
                      <CustomIcon name="ellipsis-horizontal" size={30} style={styles.moreIcon} />
                      <Text style={styles.moreText}>{trans('more')}</Text>
                    </Button>
                  </View>
                  )
              }
              </LinearGradient>
            </View>
            {
              !isFetching && !serverError
              && (
              <View style={styles.workDetail}>
                <AttendanceTable data={userAttendance} />
              </View>
              )
            }
          </View>
        </ScrollView>
        {
          !isFetching && !serverError
          && (
          <UserProfile
            visible={isProfileVisible}
            onPress={this.showUserProfile}
            data={user}
          />
          )
        }
        <ActionSheet
          ref={(o) => { this.ActionSheet = o; }}
          options={settingsMenu}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              navigation.navigate('UserGuide');
            } else if (index === 1) {
              this.LogoutConfirmation.show();
            }
          }}
        />
        <ActionSheet
          ref={(o) => { this.LogoutConfirmation = o; }}
          title={trans('logoutMessage')}
          options={confirmationArray}
          destructiveButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              this.setState({ modalVisible: true },
                () => this.unauthorizeUser(false));
            }
          }}
        />
        <CustomDialog
          visible={modalRadiusErrorVisible}
          renderIcon={infoIcon}
          description={trans('notWithinRadiusMessage')}
          buttonLabel={trans('ok')}
          onPress={() => {
            this.setState({
              modalRadiusErrorVisible: false
            });
          }}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  subscriptions: state.subscriptions,
  productId: state.product.product_identifier,
  user: state.user.user,
  userAttendance: state.user.userAttendance,
  userLocation: state.userLocation
});

const mapDispatchToProps = dispatch => ({
  setSubscriptionStatus: isSubscriber => dispatch(setSubscriptionStatus(isSubscriber)),
  setProdId: product => dispatch(setProductId(product)),
  setUser: userData => dispatch(setUserProfile(userData)),
  setAttendance: userAttendance => dispatch(setUserAttendance(userAttendance)),
  deleteState: () => dispatch(logoutUserState()),
});

export default connect(mapStateToProps, mapDispatchToProps,)(withNavigation(Dashboard));
