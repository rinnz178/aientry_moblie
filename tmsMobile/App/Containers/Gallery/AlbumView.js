import React, { PureComponent } from 'react';
import {
  View, TouchableOpacity, Text
} from 'react-native';
import { withNavigation, NavigationActions, NavigationEvents } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import { ConnectionManager, siteNames } from '../../Services';
import styles from './AlbumViewStyle';
import { List, Spinner } from '../../Components';
import trans from '../../Translations/Trans';
import defaultThumbnail from '../../Images/default_thumbnail.png';
import PlaceHolderIcon from '../../Images/EmptyListPlaceholders/album_placeholder.png';
import logoutUser from '../../Utils/LogoutHelper';
import Colors from '../../Themes';

class AlbumView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: true,
      isFetching: true,
      serverError: false,
      siteList: [],
      emptyData: trans('emptyList'),
    };

    this.openSiteAlbum = this.openSiteAlbum.bind(this);
  }

  /**
   * Calls site files API.
   *
   * @return void
   */
  componentDidMount() {
    const { isConnected } = this.state;
    // call API if there is an internet connection
    if (isConnected) {
      this.getSites();
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
    // retrieve sites if the previous state is offline and current is online
    if (!prevState.isConnected && isConnected) {
      this.getSites();
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
   * Retrieve assigned sites and thumbnail.
   *
   * @return void
   */
  getSites = () => {
    const vm = this;
    const { isConnected } = this.state;
    const { navigation } = this.props;

    // API call
    siteNames()
      .then((response) => {
        const { sites } = response.data;
        const object = [];
        // create object with uri and site_name.
        sites.forEach((site) => {
          const Site = {
            site_id: site.id,
            uri: site.thumbnail !== null ? site.thumbnail.file_path : null,
            site_name: site.name
          };
          object.push(Site);
        });
        this.handleShouldUpdateList();
        // update photos state
        vm.setState({
          siteList: object,
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
   * This will navigate to Site Gallery Screen.
   * @param {Integer} siteId
   * @param {String} siteName
   *
   * @return void
   */
  openSiteAlbum = (siteId, siteName) => {
    const { navigation } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: 'SiteGallery',
      params: { siteId, siteName },
      key: null
    });
    navigation.dispatch(navigateAction);
  }

  render() {
    const {
      siteList, isFetching, serverError, emptyData, isConnected, forbidden,
      shouldUpdateList
    } = this.state;
    return (
      <View style={[styles.container, styles.screenHeight, styles.screenWidth]}>
        <NavigationEvents
          onDidFocus={() => isConnected && this.getSites()}
        />
        <ConnectionManager connection={this.handleConnectionState} />
        { // renders spinner while fetching data from API
          (isFetching && isConnected && !serverError && !forbidden)
            && <Spinner hideStatusBar={false} />
        }
        {
          !isFetching && !serverError
          && (
            <List
              style={[styles.screenWidth, { backgroundColor: Colors.lightGray }]}
              data={siteList}
              extraData={shouldUpdateList}
              numColumns={2}
              onRefresh={() => isConnected && !serverError && this.getSites()}
              refreshing={isConnected && isFetching && !serverError}
              horizontal={false}
              imageSrc={PlaceHolderIcon}
              message={trans('emptyAlbum')}
              hideButton
              hideSeparator
              keyExtractor={(_item, index) => index}
              emptyList={siteList.length === 0 && !isFetching && emptyData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.albumButton}
                  onPress={() => this.openSiteAlbum(item.site_id, item.site_name)}
                  activeOpacity={1}
                >
                  <FastImage
                    source={item.uri ? { uri: item.uri } : defaultThumbnail}
                    style={styles.siteThumbnailStyle}
                  />
                  <Text style={styles.siteNameStyle}>
                    {item.site_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )
        }
      </View>
    );
  }
}

export default withNavigation(AlbumView);
