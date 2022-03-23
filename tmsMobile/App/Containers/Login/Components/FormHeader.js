import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Separator } from '../../../Components';

const FormHeader = (props) => {
  const { title } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <Separator />
    </View>
  );
};

export default FormHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '10%',
    marginBottom: '5%'
  },
  header: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2.5),
    paddingBottom: '5%',
  },
});
