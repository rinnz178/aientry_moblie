import React from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import FastImage from 'react-native-fast-image';
import Colors from '../../../Themes';
import { Button } from '../../../Components';
// Image icons
import docIcon from '../../../Images/File_Icons/icon_doc.png';
import xlsxIcon from '../../../Images/File_Icons/icon_xlsx.png';
import pdfIcon from '../../../Images/File_Icons/icon_pdf.png';
import txtIcon from '../../../Images/File_Icons/icon_txt.png';
import defaultIcon from '../../../Images/File_Icons/icon_default.png';
import { formatDate } from '../../../Utils/DateHelpers';

const EllipsisText = (props) => {
  const { customStyle, children, numberOfLines } = props;
  return (
    <Text
      numberOfLines={numberOfLines || 1}
      ellipsizeMode="tail"
      style={customStyle}
    >
      { children }
    </Text>
  );
};

function formatBytes(bytes) {
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (bytes === 0) {
    return '0 Bytes';
  }

  return `${parseFloat((bytes / (k ** i)).toFixed(2))}  ${sizes[i]}`;
}

function showIcon(fileType) {
  switch (fileType) {
    case 'xlsx':
      return xlsxIcon;
    case 'pdf':
      return pdfIcon;
    case 'txt':
      return txtIcon;
    case 'docx':
    case 'doc':
      return docIcon;
    default: return defaultIcon;
  }
}

const FileListItem = (props) => {
  const {
    data, onPress
  } = props;
  return (
    <Button onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <FastImage style={styles.iconStyle} resizeMode="contain" resizeMethod="scale" source={showIcon(data.file_type)} />
        </View>
        <View style={styles.textContainer}>
          <EllipsisText numberOfLines={2} customStyle={styles.itemTitle}>{data.name || ''}</EllipsisText>
          <EllipsisText customStyle={styles.itemSubTitle}>{formatDate(data.created_at) || 'MM/DD/YY 00:00 AM'}</EllipsisText>
          <EllipsisText customStyle={[styles.itemSubTitle]}>
            {formatBytes(data.size)}
          </EllipsisText>
        </View>
      </View>
    </Button>
  );
};

export default FileListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1 / 3,
    margin: 0.5
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    width: responsiveWidth(15),
    height: responsiveHeight(13)
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: '5%'
  },
  subTextContainer: {
    // flexDirection: 'row'
  },
  itemTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: Colors.black
  },
  itemSubTitle: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.gray
  },
  iconView: {
    alignContent: 'center',
    alignSelf: 'center'
  }
});
