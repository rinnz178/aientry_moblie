import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../../../Themes';
import trans from '../../../Translations/Trans';

const TableCell = (props) => {
  const { header, time } = props;
  return (
    <View style={styles.tableCell}>
      <View style={styles.headerWrapper}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.centerText, styles.header]}
        >
          { header }
        </Text>
      </View>
      <View style={styles.dataWrapper}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.centerText}
        >
          { time }
        </Text>
      </View>
    </View>
  );
};

const AttendanceTable = (props) => {
  const { data } = props;
  return (
    <View style={styles.tableContainer}>
      <TableCell header={trans('timeIn')} time={data.timeIn || '-'} />
      <TableCell header={trans('timeOut')} time={data.timeOut || '-'} />
      <TableCell header={trans('hours')} time={data.timeDiff || '-'} />
      <TableCell header={trans('remarks')} time={data.remarks !== '' ? data.remarks : '-'} />
    </View>
  );
};

export default AttendanceTable;

const styles = StyleSheet.create({
  tableContainer: {
    minWidth: '100%',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  tableCell: {
    flex: 1,
    height: '100%',
    justifyContent: 'center'
  },
  centerText: {
    fontSize: responsiveFontSize(1.7),
    textAlign: 'center'
  },
  headerWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    fontSize: responsiveFontSize(1.5),
    color: Colors.black
  },
  dataWrapper: {
    backgroundColor: Colors.aliceBlue,
    flex: 1,
    justifyContent: 'center'
  }
});
