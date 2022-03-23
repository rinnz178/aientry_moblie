import React from 'react';
import { StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Colors from '../../Themes';
import trans from '../../Translations/Trans';

const customSearchBar = (props) => {
  const { onChangeText, value } = props;
  return (
    <SearchBar
      placeholder={trans('searchHere')}
      lightTheme
      round
      onChangeText={onChangeText}
      autoCorrect={false}
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      value={value}
      clearIcon={{
        iconStyle: { margin: 10 },
        containerStyle: { margin: -10 },
      }}
    />
  );
};

export default customSearchBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
    borderBottomWidth: 0,
    borderTopWidth: 0
  },
  inputContainer: {
    backgroundColor: Colors.white
  }
});
