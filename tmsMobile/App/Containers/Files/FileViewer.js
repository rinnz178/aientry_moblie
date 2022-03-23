import React, { PureComponent } from 'react';
import {
  View, Text, Platform, PermissionsAndroid, ToastAndroid
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import RNFetchBlob from 'rn-fetch-blob';
import WebView from 'react-native-webview';
import ActionSheet from 'react-native-actionsheet';
import { SectionGrid } from 'react-native-super-grid';
import styles from './FileViewerStyle';
import { ConnectionManager, files } from '../../Services';
import {
  Button, ServerError, Spinner, Modal,
  ModalContainer, Separator, SearchBar, Placeholder,
} from '../../Components';
import FileListItem from './Components/FileListItem';
import trans from '../../Translations/Trans';
import PlaceholderIcon from '../../Images/EmptyListPlaceholders/files_placeholder.png';

const fileAction = [
  trans('cancel')
];

Platform.OS === 'android' ? fileAction.unshift(trans('download')) : fileAction.unshift(trans('view'));

class FileViewer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      webviewVisible: false,
      isConnected: true,
      isFetching: true,
      serverError: false,
      url: '',
      fileName: '',
      data: [],
      dataToShow: [],
      search: '',
    };
  }

  componentDidMount() {
    const { isConnected } = this.state;
    if (isConnected) {
      this.getFiles();
    }

    this.requestStorageAccess();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isConnected } = this.state;
    if (!prevState.isConnected && isConnected) {
      this.getFiles();
    }
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  }

  handleConnectionState = async (isConnected) => {
    this.setState({ isConnected });
  }

  getFiles = async () => {
    const vm = this;
    const { isConnected } = this.state;
    let siteInfo = [];
    let sectionList = [];
    files()
      .then((response) => {
        response.data.forEach((site) => {
          if (site.files.length > 0) {
            siteInfo = {
              title: site.name,
              data: site.files
            };
            sectionList = sectionList.concat(siteInfo);
          }
        });
        vm.setState({
          data: sectionList,
          dataToShow: sectionList,
          isFetching: false,
          serverError: false
        });
      }).catch((error) => {
        // unauthenticated or expired token
        if (error.status === 401) {
          vm.forceLogout();
        } else {
          isConnected && vm.setState({ serverError: true, isFetching: true });
        }
      });
  }

  showActionsModal = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  }

  setSelectedFile = (url, fileName) => {
    this.setState({
      url,
      fileName
    });
  }

  showWebModal = () => {
    const { webviewVisible } = this.state;
    this.setState({
      webviewVisible: !webviewVisible,
    });
  }

  requestStorageAccess = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
  }

  downloadFile = async () => {
    const { url, fileName } = this.state;
    const dir = RNFetchBlob.fs.dirs;

    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );

    if (permission === PermissionsAndroid.RESULTS.GRANTED) {
      ToastAndroid.show(trans('toastDownload'), ToastAndroid.SHORT);
      RNFetchBlob
        .config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: `${dir.DownloadDir}/${fileName}`,
          }
        })
        .fetch('GET', url, {
        })
        .then(() => {
          ToastAndroid.show(trans('toastCompleteDownload'), ToastAndroid.SHORT);
        });
    } else {
      this.requestStorageAccess();
    }
  }

  searchFilterFunction(text) {
    // passing the inserted text in textinput
    const matchedItemsArray = [];
    const { data } = this.state;

    if (text === '') {
      this.setState({ search: false, dataToShow: data });
    } else {
      this.setState({ search: true, dataToShow: data }, function checkData() {
        const { dataToShow } = this.state;
        dataToShow.forEach((item) => {
          item.data.forEach((file, index) => {
            const name = file.name.toUpperCase();
            // Compares text
            if (name.includes(text.toUpperCase())) {
              let findName = [];
              findName = matchedItemsArray.find(({ title }) => title === item.title);
              if (findName) {
                findName.data.push(file);
              } else {
                const itemFound = { title: item.title, data: [item.data[index]] };
                matchedItemsArray.push(itemFound);
              }
            }
          });
        });
        this.setState({
          dataToShow: matchedItemsArray
        });
      });
    }
  }

  renderEmptyList = () => (
    <Placeholder
      imageSrc={PlaceholderIcon}
      message={trans('emptyFile')}
      hideButton
    />
  )

  render() {
    const {
      isFetching, isConnected, dataToShow,
      serverError, webviewVisible, url, search, data
    } = this.state;

    return (
      <View style={styles.container}>
        <ConnectionManager connection={this.handleConnectionState} />
        {
          data.length > 0 && (
            <SearchBar
              onChangeText={text => this.searchFilterFunction(text)}
              value={search}
            />
          )
        }
        { // renders spinner while fetching data from API
          (isFetching && isConnected && !serverError) && <Spinner hideStatusBar={false} />
        }
        {
          (isFetching && isConnected && serverError)
          && (
            <ServerError
              serverError={serverError}
              onPress={() => isConnected && this.getFiles()}
            />
          )
        }
        {
          !isFetching && !serverError
          && (
            // shows list of files
            <SectionGrid
              sections={dataToShow}
              itemDimension={90}
              style={styles.listContainer}
              stickySectionHeadersEnabled={false}
              onRefresh={() => isConnected && !serverError && this.getFiles()}
              refreshing={isConnected && isFetching && !serverError}
              ListEmptyComponent={() => (
                data.length === 0 && !isFetching) && this.renderEmptyList()
              }
              renderSectionHeader={({ section }) => (
                <Text style={styles.sectionHeader}>{section.title}</Text>
              )}
              renderItem={({ item }) => (
                <FileListItem
                  data={item}
                  onPress={() => {
                    this.showActionSheet();
                    this.setSelectedFile(item.file_path, item.name);
                  }}
                />
              )}
              keyExtractor={item => item.id.toString()}
            />
          )
        }
        {
          <Modal
            customStyle={styles.modalStyle}
            visible={webviewVisible}
            onBackdropPress={this.showWebModal}
            onSwipeComplete={this.showWebModal}
          >
            {/* Show files to Webview */}
            <ModalContainer height={responsiveHeight(90)}>
              <View style={styles.viewClose}>
                <Button onPress={this.showWebModal}>
                  <Text style={styles.closeText}>{trans('close')}</Text>
                </Button>
              </View>
              <Separator customStyle={styles.width} />
              <View style={[styles.webviewStyle, styles.width]}>
                <WebView
                  source={{ uri: url }}
                  onLoadProgress={({ nativeEvent }) => {
                    this.ActivityIndicatorLoadingView = nativeEvent.url;
                  }}
                  startInLoadingState
                />
              </View>
            </ModalContainer>
          </Modal>
        }
        <ActionSheet
          ref={(o) => { this.ActionSheet = o; }}
          options={fileAction}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              Platform.OS === 'android'
                ? this.downloadFile()
                : this.showWebModal();
            }
          }}
        />
      </View>
    );
  }
}

export default withNavigation(FileViewer);
