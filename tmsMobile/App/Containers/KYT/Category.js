import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { withNavigation, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import styles from './Styles/CommonStyle';
import {
  ListItem, Button, Spinner, Forbidden, Placeholder, OverlayLoader, CustomDialog
} from '../../Components';
import SectionList from '../../Components/src/SectionList';
import { ConnectionManager, categories, answerKYT } from '../../Services';
import trans from '../../Translations/Trans';
import logoutUser from '../../Utils/LogoutHelper';
import ServerErrorIcon from '../../Images/EmptyListPlaceholders/server_error.png';
import checkIcon from '../../Images/icon_checkmark.png';
import infoIcon from '../../Images/icon_info.png';
import { setKYTAnswer } from './Store/actions';

class KYTCategory extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const { setID, setIndex } = navigation.state.params;
    this.state = {
      isConnected: true,
      isFetching: true,
      serverError: false,
      forbidden: false,
      shouldUpdateList: false,
      isLoaderVisible: false,
      isDialogVisible: false,
      message: trans('kytHasAnswered'),
      emptyData: trans('NoKYTavailable'),
      data: [],
      setID,
      setIndex,
      hasAnswered: false,
      totalQuestion: 0,
      dialogIcon: checkIcon,
    };

    this.handleDataChange = this.handleDataChange.bind(this);
  }

  componentDidMount() {
    const { isConnected } = this.state;
    if (isConnected) {
      this.getKYTCategory();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isConnected } = this.state;
    if (!prevState.isConnected && isConnected) {
      this.getKYTCategory();
    }
  }

  /**
   * @param {boolean} shouldUpdateView
   * @param {Object} editableCategory
   * Updates the view for number of answered question(s) or
   * number of questions
   *
   */
  handleDataChange = (shouldUpdateView, editableCategory) => {
    const { data } = this.state;
    const vm = this;
    data.forEach((parent, parentIndex) => {
      parent.data.forEach((category, index) => {
        if (category.id === editableCategory.id) {
          vm.setState((prevState) => {
            const prevData = [...prevState.data];
            prevData[parentIndex].data[index] = {
              ...prevData[parentIndex].data[index],
              number_of_questions: editableCategory.number_of_questions
            };
          }, () => vm.setState({ shouldUpdateList: true }));
        }
      });
    });
    shouldUpdateView && vm.setState({ shouldUpdateList: true });
  }

  /**
   * This function will get the value of connection props from ConnectionManager
   */
  handleConnectionState = async (isConnected) => {
    this.setState({ isConnected });
  }

  submitAnswer = async () => {
    const vm = this;
    const {
      setID, isConnected, setIndex, totalQuestion
    } = this.state;
    const { kyt } = this.props;
    const answersHolder = [];
    // get all answers and save it to one answersHolder array
    for (let i = 0; i < kyt[setIndex].progress.length; i += 1) {
      for (let y = 0; y < kyt[setIndex].progress[i].answers.length; y += 1) {
        const answer = kyt[setIndex].progress[i].answers[y];
        answersHolder.push(answer);
      }
    }

    if (answersHolder.length !== totalQuestion) {
      this.setState({
        message: trans('unansweredKYT'),
        isDialogVisible: true,
        dialogIcon: infoIcon
      });
      return;
    }
    vm.setState({
      isLoaderVisible: true
    },
    () => {
      answerKYT(setID, answersHolder).then(() => {
        vm.setState({
          message: trans('kytAnswersSubmitted'),
          dialogIcon: checkIcon,
          isLoaderVisible: false,
        });
        // reset local state
        const resetAnswers = [...kyt, ...kyt[setIndex].progress = []];
        vm.props.setAnswer(resetAnswers);
        vm.getKYTCategory();
      }).catch((error) => {
        // unauthenticated or expired token
        if (error.status === 401) {
          vm.forceLogout();
        } else {
          isConnected && vm.setState({ serverError: true, isFetching: true });
        }
      });
    });
  }

  getKYTCategory = async () => {
    const vm = this;
    const { isConnected, setID } = this.state;
    const { navigation } = this.props;
    let kytCategory = [];
    let sectionList = [];
    let hasGeneratedAnswer = true;
    categories(setID)
      .then((response) => {
        vm.setState({
          hasAnswered: response.has_answered,
          totalQuestion: response.total_questions
        });
        response.data.forEach((category) => {
          const isEditable = category.is_editable_mobile;
          const childCategory = category.kyt_child_categories || -1;
          if (!isEditable && childCategory === -1) {
            // no generated KYT answer(s)
            hasGeneratedAnswer = false;
            vm.setState({
              emptyData: trans('nextKYTschedule')
            });
          }
          if (isEditable || childCategory.length > 0) {
            // creates an object with title and data. This is for SectionList.
            kytCategory = {
              title: childCategory.length > 0 ? category.name : '',
              data: childCategory.length > 0
                ? childCategory
                : [{
                  id: category.id,
                  name: category.name,
                  is_editable_mobile: true,
                  has_answered: category.has_answered,
                  number_of_questions: category.number_of_questions || 0
                }]
            };
          }
          sectionList = sectionList.concat(kytCategory);
        });
        vm.setState({
          data: hasGeneratedAnswer ? sectionList : [],
          isFetching: false,
          serverError: false,
          forbidden: false
        });
      }).catch((error) => {
        // unauthenticated or expired token
        if (error.status === 401) {
          logoutUser(isConnected, navigation);
        } else if (error.status === 403) { // unauthorized or does not have permission
          isConnected && vm.setState({ forbidden: true, isFetching: true });
        } else {
          // this.setState({ serverError: true });
          isConnected && vm.setState({ serverError: true, isFetching: true });
        }
      });
  }

  showDialog() {
    this.setState(prevState => ({ isDialogVisible: !prevState.isDialogVisible }));
  }

  /**
   * This function will navigate to KYT Question screen
   *
   * @param {Integer} setID - this will be used when answering a question
   * @param {Integer} categoryID - pass the category ID as parameter
   * @param {Boolean} isEditable - if true, User can add a question
   *
   */
  navigate(setID, categoryID, isEditable) {
    this.setState({
      // set state to false when moving to Question Screen
      shouldUpdateList: false
    });
    const { navigation } = this.props;
    const { setIndex } = this.state;
    const navigateAction = NavigationActions.navigate({
      routeName: 'KYTQuestion',
      params: {
        setID,
        categoryID,
        isEditable,
        handleDataChange: this.handleDataChange,
        setIndex
      },
      key: null
    });
    navigation.dispatch(navigateAction);
  }

  renderListFooter = () => {
    const { hasAnswered, data } = this.state;

    if (data.length > 0) {
      return (
        <View style={styles.footerBottomContainer}>
          <Button
            disabled={hasAnswered}
            style={[styles.footerButton, hasAnswered && styles.disabled]}
            onPress={() => this.submitAnswer()}
          >
            <Text style={styles.footerButtonText}>
              {trans('submit')}
            </Text>
          </Button>
        </View>
      );
    }
    return null;
  }

  render() {
    const {
      data, isFetching, isConnected, emptyData, serverError, forbidden,
      setID, shouldUpdateList, setIndex, isLoaderVisible, isDialogVisible,
      message, dialogIcon
    } = this.state;
    const { kyt } = this.props;
    const answers = kyt[setIndex].progress;
    return (
      <View style={styles.container}>
        <ConnectionManager connection={this.handleConnectionState} />
        <OverlayLoader
          onModalHide={() => this.showDialog()}
          visible={isLoaderVisible}
        />
        <CustomDialog
          visible={isDialogVisible}
          renderIcon={dialogIcon}
          title={message}
          buttonLabel={trans('done')}
          onPress={() => this.showDialog()}
        />
        { // renders spinner while fetching data from API
          (isFetching && isConnected && !serverError && !forbidden)
            && <Spinner hideStatusBar={false} />
        }
        { // renders server error page
          (isFetching && isConnected && serverError)
          && (
            <Placeholder
              imageSrc={ServerErrorIcon}
              message={trans('serverError')}
              imageStyle={styles.serverErrorIcon}
              btnText={trans('retry')}
              onPress={() => isConnected && this.getKYTCategory()}
            />
          )
        }
        { // renders forbidden page when status code === 403
          (isFetching && isConnected && forbidden)
          && (
            <Forbidden
              forbidden={forbidden}
              onPress={() => isConnected && this.getKYTCategory()}
            />
          )
        }
        {
          !isFetching && !serverError && !forbidden
          && (
            <SectionList
              sections={data}
              extraData={shouldUpdateList}
              headerStyle={styles.sectionHeader}
              onRefresh={() => isConnected && !serverError && this.getKYTCategory()}
              refreshing={isConnected && isFetching && !serverError}
              hideButton
              message={emptyData}
              renderItem={({ item }) => (
                <Button
                  style={[styles.buttonStyle, {
                    opacity: (item.has_answered)
                      ? 0.4 : 1
                  }]}
                  disabled={item.has_answered}
                  onPress={() => this.navigate(setID, item.id, item.is_editable_mobile)}
                >
                  <ListItem
                    chevronSize={20}
                    description={item.name}
                    hasAnswered={item.has_answered}
                    answers={answers}
                    extraData={item}
                    containerStyle={styles.listItemStyle}
                  />
                </Button>
              )}
              keyExtractor={item => item.id.toString()}
              ListFooterComponent={this.renderListFooter}
            />
          )
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  kyt: state.kyt.sets,
});

const mapDispatchToProps = dispatch => ({
  setAnswer: category => dispatch(setKYTAnswer(category)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(KYTCategory));
