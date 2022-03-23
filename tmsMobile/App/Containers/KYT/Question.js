import React, { PureComponent } from 'react';
import {
  View, Keyboard
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import styles from './Styles/QuestionStyle';
import {
  Separator, Spinner, List,
} from '../../Components';
import FAB from './Components/FAB';
import {
  questions, ConnectionManager, postQuestion
} from '../../Services';
import trans from '../../Translations/Trans';
import logoutUser from '../../Utils/LogoutHelper';
import QuestionItem from './Components/QuestionItem';
import { setKYTAnswer } from './Store/actions';

const choices = [
  { label: trans('yes'), value: 0 },
  { label: trans('no'), value: 1 },
  { label: trans('maybe'), value: 2 }
];

class Question extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const {
      categoryID, isEditable, setIndex
    } = navigation.state.params;
    this.state = {
      isQuestionBoxVisible: false,
      isConnected: true,
      isFetching: true,
      loading: false,
      data: [],
      page: 1,
      lastPage: 1,
      emptyData: 'Questions not found.\nPlease click (+) button to add it.',
      categoryID,
      isEditable,
      setIndex,
      shouldUpdateView: false,
      editableCategory: {
        id: -1,
        number_of_questions: 0
      }
    };

    this.getQuestions = this.getQuestions.bind(this);
    this.postQuestion = this.postQuestion.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  componentDidMount() {
    const { isConnected } = this.state;
    if (isConnected) {
      this.getQuestions();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isConnected } = this.state;

    if (!prevState.isConnected && isConnected) {
      this.getQuestions();
    }
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    const { shouldUpdateView, editableCategory } = this.state;
    navigation.state.params.handleDataChange(shouldUpdateView, editableCategory);
  }

  /**
   * This function will get the value of connection props from ConnectionManager
   */
  handleConnectionState = async (isConnected) => {
    this.setState({ isConnected });
  }

  getQuestions = async () => {
    const vm = this;
    const {
      isConnected, categoryID, page, setIndex
    } = this.state;
    const { navigation, kytAnswer } = this.props;
    questions(categoryID, page)
      .then((response) => {
        const { data } = this.state;
        const dataHolder = response.data;
        const categoryIndex = kytAnswer[setIndex].progress.findIndex(
          set => set.category_id === vm.state.categoryID
        );
        if (categoryIndex >= 0) {
          for (let i = 0; i < kytAnswer[setIndex].progress[categoryIndex].answers.length; i += 1) {
            const tempIndex = response.data.findIndex(
              question => question.id === kytAnswer[setIndex].progress[categoryIndex].answers[i].id
            );
            if (tempIndex >= 0) {
              dataHolder[tempIndex] = {
                ...dataHolder[tempIndex],
                answer: kytAnswer[setIndex].progress[categoryIndex].answers[i].answer
              };
            }
          }
        }
        vm.setState({
          data: page === 1
            ? dataHolder : [...data, ...dataHolder],
          lastPage: response.metadata.last_page,
          loading: false,
          isFetching: false,
          serverError: false
        });
      }).catch((error) => {
        // unauthenticated or expired token
        vm.setState({ loading: false });
        if (error.status === 401) {
          logoutUser(isConnected, navigation);
        } else {
          isConnected && vm.setState({ serverError: true, isFetching: true });
        }
      });
  }

  loadMoreQuestions = () => {
    const { page, lastPage } = this.state;
    this.setState({ page: page + 1 },
      () => page <= lastPage
        && this.setState({ loading: true }, () => this.getQuestions()));
  };

  updateAnswer = (id, value) => {
    const { setIndex, categoryID } = this.state;
    const { kytAnswer, setAnswer } = this.props;
    const vm = this;
    const categoryIndex = kytAnswer[setIndex].progress.findIndex(
      set => set.category_id === categoryID
    );
    vm.setState({
      shouldUpdateView: true
    });
    if (categoryIndex < 0) {
      const tempAnswer = kytAnswer;
      tempAnswer[setIndex].progress.push(
        {
          category_id: categoryID,
          answers: [{
            id,
            answer: value
          }]
        }
      );
      setAnswer(tempAnswer);
    }

    if (categoryIndex >= 0) {
      const answerIndex = kytAnswer[setIndex].progress[categoryIndex].answers.findIndex(
        question => question.id === id
      );
      if (answerIndex < 0) {
        const addAnswer = kytAnswer;
        addAnswer[setIndex].progress[categoryIndex].answers.push({
          id,
          answer: value
        });
        setAnswer(addAnswer);
      } else {
        const updateAnswer = kytAnswer;
        updateAnswer[setIndex].progress[categoryIndex].answers[answerIndex].answer = value;
        setAnswer(updateAnswer);
      }
    }
  }

  postQuestion = async (question) => {
    const vm = this;
    const {
      categoryID, isConnected
    } = this.state;

    Keyboard.dismiss();
    vm.setState({ isFetching: true });
    postQuestion(categoryID, question).then((response) => {
      vm.setState({
        message: trans('addedQuestion'),
        data: response.data || [],
        question: '',
        updateList: true,
        shouldUpdateView: true,
        editableCategory: {
          id: categoryID,
          number_of_questions: response.data.length
        }
      }, () => vm.setState({ isFetching: false }));
    }).catch((error) => {
      // unauthenticated or expired token
      if (error.status === 401) {
        vm.forceLogout();
      } else {
        isConnected && vm.setState({ serverError: true, isFetching: true });
      }
    });
  }

  showAddQuestionScreen() {
    this.setState(prevState => ({ isQuestionBoxVisible: !prevState.isQuestionBoxVisible }));
  }

  renderFooter = () => {
    const { loading } = this.state;
    // it will show indicator at the bottom of the list while fetching
    // data otherwise it returns null
    if (!loading) return null;
    return (
      <Spinner size="small" />
    );
  };

  render() {
    const {
      data, isFetching, isEditable, isConnected,
      serverError, emptyData,
    } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <ConnectionManager connection={this.handleConnectionState} />
        {
          // renders list view after fetching data
          !serverError
          && (
            <View style={styles.listContainer}>
              <List
                data={data}
                extraData={this.state}
                initialNumToRender={10}
                onRefresh={() => (isConnected && !serverError) && this.getQuestions()}
                refreshing={isConnected && isFetching && !serverError}
                keyExtractor={item => item.id.toString()}
                hideButton
                message={!isFetching && emptyData}
                onEndReached={() => this.loadMoreQuestions()}
                renderItem={({ item }) => (
                  <QuestionItem
                    data={item}
                    choices={choices}
                    onPress={choice => this.updateAnswer(item.id, choice.value)}
                  />
                )}
                ItemSeparatorComponent={
                  () => <Separator customStyle={styles.renderSeparatorStyle} />
                }
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.5}
                maxToRenderPerBatch={10}
              />
            </View>
          )
        }
        { // will display if user can add a question to this category
          isEditable
            && <FAB onPress={() => navigation.navigate('AddQuestion', { postQuestion: this.postQuestion })} />
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  kytAnswer: state.kyt.sets,
});

const mapDispatchToProps = dispatch => ({
  setAnswer: category => dispatch(setKYTAnswer(category)),
});

export default connect(mapStateToProps, mapDispatchToProps,)(withNavigation(Question));
