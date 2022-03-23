import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import RadioForm from 'react-native-radio-form';
import Colors from '../../../Themes';

const QuestionItem = (props) => {
  const { onPress, data, choices } = props;
  const initialAnswer = data.answer >= 0 ? data.answer : null;
  return (
    <View style={styles.container}>
      <Text style={[styles.questionStyle, styles.textSize]}>
        {data.question}
      </Text>
      <View style={styles.itemViewStyle}>
        <RadioForm
          style={{ width: null }}
          dataSource={choices}
          itemShowKey="label"
          labelStyle={[styles.radioLabelStyle, styles.textSize]}
          itemRealKey="value"
          circleSize={responsiveWidth(8)}
          initial={initialAnswer}
          outerColor={Colors.base}
          innerColor={Colors.base}
          formHorizontal
          labelHorizontal
          onPress={onPress}
        />
      </View>
    </View>
  );
};

export default QuestionItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  textSize: {
    fontSize: responsiveFontSize(2)
  },
  radioLabelStyle: {
    color: Colors.gray,
  },
  questionStyle: {
    marginBottom: responsiveHeight(5)
  }
});
