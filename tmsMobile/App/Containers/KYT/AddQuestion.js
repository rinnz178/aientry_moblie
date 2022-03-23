import React, { PureComponent } from 'react';
import {
  View, Text, TextInput, StyleSheet
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Button, StatusBar, HeaderBackButton } from '../../Components';
import defaultNavigationOptions from '../../Navigation/NavigationOptions';
import trans from '../../Translations/Trans';
import Colors from '../../Themes';

class AddQuestion extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    ...defaultNavigationOptions,
    headerTitle: () => (
      <Text style={styles.header}>{trans('addQuestionHeader')}</Text>
    ),
    headerRight: () => (
      <Button
        style={styles.buttonStyle}
        disabled={navigation.getParam('question') === ''}
        onPress={navigation.getParam('returnQuestion')}
      >
        <Text
          style={[styles.actionsText, (navigation.getParam('question') === '' || navigation.getParam('question') === undefined)
            ? { color: '#e68417' } : { color: Colors.white }]}
        >
          {trans('submit')}
        </Text>
      </Button>
    ),
    headerLeft: () => (
      <HeaderBackButton onPress={() => navigation.goBack(null)} />
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      question: '',

    };

    this.returnQuestion = this.returnQuestion.bind(this);
  }

  componentDidMount() {
    const { question } = this.state;
    const { navigation } = this.props;
    navigation.setParams({
      returnQuestion: this.returnQuestion,
      question
    });
  }

  returnQuestion() {
    const { navigation } = this.props;
    const { question } = this.state;
    navigation.goBack();
    navigation.state.params.postQuestion(question);
  }

  _handleQuestionInput(text) {
    this.setState({ question: text });
    const { navigation } = this.props;
    navigation.setParams({
      question: text
    });
  }

  render() {
    const { question } = this.state;
    return (
      <View style={[styles.container, styles.screenWidth]}>
        <StatusBar backgroundColor="transparent" translucent />
        <View style={[styles.textInputContainer, styles.screenHeight, styles.screenWidth]}>
          <TextInput
            style={[styles.textInputStyle, styles.screenHeight]}
            placeholder={trans('addQuestionPlaceholder')}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            value={question}
            onChangeText={text => this._handleQuestionInput(text)}
          />
        </View>
      </View>
    );
  }
}

export default AddQuestion;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomColor: Colors.lightGray,
    alignItems: 'center',
    height: responsiveHeight(55)
  },
  modalStyle: {
    justifyContent: 'flex-end'
  },
  screenWidth: {
    width: '100%'
  },
  screenHeight: {
    height: '100%'
  },
  header: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2.2),
    padding: '2%',
    color: Colors.white
  },
  textInputContainer: {
    flex: 1,
    padding: 5
  },
  textInputStyle: {
    fontSize: responsiveFontSize(2),
    textAlignVertical: 'top'
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: responsiveHeight(3),
    height: 90
  },
  actionsText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
  },
  buttonStyle: {
    marginRight: responsiveWidth(5)
  },
  red: {
    color: Colors.red
  },
  gainsboro: {
    color: Colors.gainsboro
  },
  background: {
    width: '100%'
  }
});
