import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import CustomIcon from './Icon';
import Colors from '../../Themes';

const EllipsisText = (props) => {
  const { customStyle, numOfLines, children } = props;
  return (
    <Text
      numberOfLines={numOfLines || 1}
      ellipsizeMode="tail"
      style={customStyle}
    >
      { children }
    </Text>
  );
};


const ListItem = (props) => {
  const {
    title, subtitle, description, hasChevron = true, chevronColor,
    chevronSize, containerStyle, name, onPress, hasAnswered, hasScheduleToday,
    extraData, answers
  } = props;
  let numberOfQuestions = 0;
  let answeredQuestions = 0;
  if (answers && extraData) {
    numberOfQuestions = extraData.number_of_questions || 0;
    const index = answers.findIndex(category => category.category_id === extraData.id);
    if (index >= 0) {
      answeredQuestions = answers[index].answers.length;
    }
  }
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.textRow}>
        {title && <EllipsisText customStyle={styles.itemTitle}>{title}</EllipsisText>}
        {subtitle && <EllipsisText customStyle={styles.itemSubTitle}>{subtitle}</EllipsisText>}
        {description
          && (
          <EllipsisText numOfLines={2} customStyle={styles.itemDescription}>
            {description}
          </EllipsisText>
          )
        }
      </View>
      {
        hasChevron && extraData && !hasAnswered && (
          <View style={styles.iconView}>
            <Text>
              {numberOfQuestions === '' ? '' : `${answeredQuestions} / ${numberOfQuestions}`}
            </Text>
          </View>
        )
      }
      {
        (hasAnswered || (!hasScheduleToday && hasScheduleToday !== undefined))
        && (
          <View style={styles.iconView}>
            <CustomIcon
              name={hasAnswered ? 'ios-checkmark' : 'lock-closed-outline'}
              onPress={onPress}
              color={hasAnswered ? Colors.green : Colors.gray}
              size={30}
            />
          </View>
        )
      }
      {
        hasChevron
        && (
          <View style={styles.iconView}>
            <CustomIcon
              name={name || 'ios-arrow-forward'}
              onPress={onPress}
              color={chevronColor}
              size={chevronSize}
            />
          </View>
        )
      }
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  itemTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '600',
    color: Colors.black
  },
  itemSubTitle: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: '300',
    color: Colors.gray
  },
  itemDescription: {
    fontSize: responsiveFontSize(2),
    color: Colors.gray
  },
  textRow: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: '5%'
  },
  iconView: {
    alignContent: 'center',
    alignSelf: 'center',
    marginRight: '3%'
  }
});
