import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { withNavigation, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import moment from 'moment';
import { connect } from 'react-redux';
import Config from 'react-native-config';
import setSubscriptionStatus from '../../Store/SubscriptionStatus/actions';
import { setKYTAnswer } from './Store/actions';
import styles from './Styles/CommonStyle';
import {
  ConnectionManager, sets, setReminder,
} from '../../Services';
import {
  Button, List, ListItem, Spinner, Forbidden, StatusBar, Placeholder
} from '../../Components';
import trans from '../../Translations/Trans';
import { toTwelveHourFormat } from '../../Utils/DateHelpers';
import logoutUser from '../../Utils/LogoutHelper';
import getUserSubscription from '../../Utils/SubscriptionStatus';
import PlaceHolderIcon from '../../Images/EmptyListPlaceholders/kyt_placeholder.png';
import ServerErrorIcon from '../../Images/EmptyListPlaceholders/server_error.png';
import Colors from '../../Themes';

class KYTSet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      isFetching: true,
      serverError: false,
      forbidden: false,
      emptyData: trans('emptyList'),
      data: [],
    };
  }

  async componentDidMount() {
    const { isConnected } = this.state;
    const { subscriptions } = this.props;
    const vm = this;
    if (isConnected) {
      const userSubscription = await getUserSubscription();
      vm.props.setSubscriptionStatus(userSubscription);
      this.getKYTsets();
    }

    // remove previous scheduled notifications if user is not a subscriber
    if (!subscriptions[Config.KYT_ID]) {
      firebase.notifications().cancelAllNotifications();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isConnected, data } = this.state;
    const { subscriptions } = this.props;
    // retrieve KYT Sets if the previous state is offline and current is online
    if (!prevState.isConnected && isConnected) {
      this.getKYTsets();
    }

    // set notification schedule
    if (data.length > 0 && subscriptions[Config.KYT_ID]) {
      firebase.notifications().cancelAllNotifications(); // remove previous scheduled notifications
      for (let i = 0; i < data.length; i += 1) {
        setReminder(data[i]);
      }
    }
  }

  /**
   * This function will get the value of connection props from ConnectionManager
   */
  handleConnectionState = async (isConnected) => {
    this.setState({ isConnected });
  }

  getKYTsets = async () => {
    const vm = this;
    const { isConnected } = this.state;
    const { navigation, setAnswer, kyt } = this.props;
    sets()
      .then((response) => {
        let set = [];
        for (let i = 0; i < response.data.length; i += 1) {
          const index = kyt.findIndex(kytSet => kytSet.id === response.data[i].id);
          if (index < 0) {
            set.push({
              id: response.data[i].id,
              site_name: response.data[i].name,
              progress: []
            });
          } else {
            set = [...kyt];
          }
        }
        setAnswer(set);
        vm.setState({
          data: response.data || [], // set data to empty array if response is undefined
          isFetching: false,
          serverError: false,
          forbidden: false
        });
      }).catch((error) => {
        if (error.status === 401) { // unauthenticated or expired token
          logoutUser(isConnected, navigation);
        } else if (error.status === 403) { // unauthorized or does not have permission
          isConnected && vm.setState({ forbidden: true, isFetching: true });
        } else {
          isConnected && vm.setState({ serverError: true, isFetching: true });
        }
      });
  }

  checkSchedule = (scheduledDays) => {
    const currentDay = moment().format('dddd').toLowerCase();
    let hasScheduleToday = false;
    scheduledDays.forEach((day) => {
      if (day === currentDay) {
        hasScheduleToday = true;
      }
    });
    return hasScheduleToday;
  }

  /**
   * This function will navigate to specified screen
   *
   * @param {Integer} setID
   */
  navigate = (setID, routeName) => {
    const { navigation, kyt } = this.props;
    const setIndex = kyt.findIndex(set => set.id === setID);
    const navigateAction = NavigationActions.navigate({
      routeName,
      params: { setID, setIndex },
      key: null
    });
    navigation.dispatch(navigateAction);
  }

  showDialog() {
    this.setState(prevState => ({ isDialogVisible: !prevState.isDialogVisible }));
  }

  render() {
    const {
      data, isFetching, isConnected, emptyData, serverError, forbidden,
    } = this.state;
    const { subscriptions } = this.props;

    const hasServerError = isFetching && isConnected && serverError;
    const isSubscriber = !subscriptions[Config.KYT_ID] && !isFetching && !serverError && !forbidden;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" translucent />
        <ConnectionManager connection={this.handleConnectionState} />
        { // renders spinner while fetching data from API
          (isFetching && isConnected && !serverError && !forbidden)
            && <Spinner hideStatusBar={false} />
        }
        { // renders server error page
          hasServerError
          && (
            <Placeholder
              imageSrc={ServerErrorIcon}
              message={trans('serverError')}
              imageStyle={styles.serverErrorIcon}
              btnText={trans('retry')}
              onPress={() => isConnected && this.getKYTsets()}
            />
          )
        }
        { // shows message when user is not subscribed to this feature
          (isSubscriber)
          && (
            <Placeholder
              imageSrc={PlaceHolderIcon}
              message={trans('kytPromotionalDescription')}
              btnText={trans('viewPlans')}
              btnTextStyle={{ color: Colors.base }}
              btnStyle={styles.promotionalBtn}
              onPress={() => this.navigate(null, 'Upgrade')}
            />
          )
        }
        { // renders forbidden page when status code === 403
          (isFetching && isConnected && forbidden)
          && (
            <Forbidden
              forbidden={forbidden}
              onPress={() => isConnected && this.getKYTsets()}
            />
          )
        }
        { // shows list of KYT Set
          !isFetching && !serverError && !forbidden && subscriptions[Config.KYT_ID]
          && (
            <List
              data={data}
              extraData={this.state}
              onRefresh={() => isConnected && !serverError && this.getKYTsets()}
              refreshing={isConnected && isFetching && !serverError}
              emptyList={data.length === 0 && !isFetching && emptyData}
              imageSrc={PlaceHolderIcon}
              message={trans('emptyKYT')}
              hideButton
              renderItem={({ item }) => (
                <Button
                  onPress={() => this.navigate(item.id, 'KYTCategory')}
                  disabled={!this.checkSchedule(item.weekdays)}
                >
                  <ListItem
                    title={item.name}
                    subtitle={item.site_name}
                    hasScheduleToday={this.checkSchedule(item.weekdays)}
                    description={`${toTwelveHourFormat(item.start_time)} - ${toTwelveHourFormat(item.end_time)}`}
                    containerStyle={styles.listItemStyle}
                  />
                </Button>
              )}
              keyExtractor={item => item.id.toString()}
            />
          )
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  subscriptions: state.subscriptions,
  kyt: state.kyt.sets
});

const mapDispatchToProps = dispatch => ({
  setSubscriptionStatus: isSubscriber => dispatch(setSubscriptionStatus(isSubscriber)),
  setAnswer: setID => dispatch(setKYTAnswer(setID)),
});

export default connect(mapStateToProps, mapDispatchToProps,)(withNavigation(KYTSet));
